import IUser from "../interfaces/user.interface"
import { ITokenData, IDataStoredInToken } from "../interfaces/jwt.interface"
import jwt from "jsonwebtoken";
import cron from "node-cron";
import Ticket from "../models/ticket.model";
import ITicket from "../interfaces/ticket.interface";
import { CallbackError } from "mongoose";
import { ObjectId } from "bson";
import Cart from "../models/cart.model";
import ICart from "../interfaces/cart.interface";
import nodemailer from "nodemailer";
import IScreening from "../interfaces/screening.interface";

export default class UtilClass {

    static nodemailerConfig = {
        host: <string>process.env.NODEMAILER_HOST,
        port: parseInt(<string>process.env.NODEMAILER_PORT),
        secure: false,
        auth: {
            user: <string>process.env.NODEMAILER_EMAIL,
            pass: <string>process.env.NODEMAILER_PASSWORD
        }
    }

    static createToken(user: IUser): ITokenData {
        const expiresIn = 60 * 60 * 4;
        const secret = <string>process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
    static getNodeMailerTransporter() {
        return nodemailer.createTransport({
            host: <string>process.env.NODEMAILER_HOST,
            port: parseInt(<string>process.env.NODEMAILER_PORT),
            secure: false,
            auth: {
                user: <string>process.env.NODEMAILER_EMAIL,
                pass: <string>process.env.NODEMAILER_PASSWORD
            },
            from: 'Cinemy Reservierungsassistent'
        })
    }

    static async sendPaymentEmail(recipient: string, ticketId: string) {
        try {
        let ticket = await Ticket.findById(ticketId).populate({
            path: 'screening',
            populate: {
                path: 'movie',
                model: 'movies'
            }
        });
        if(!ticket) {
            console.log("ticket not found for email");
            return
        }
        console.log(ticket)
        this.getNodeMailerTransporter().sendMail({
            to: recipient,
            subject: 'Ihre Bezahlung',
            text: `Sie haben ein Ticket für den Film ${(<IScreening>ticket.screening).movie.title} bezahlt.
            Vorstellungsstart: ${(<IScreening>ticket.screening).startDate}
            Vorstellungsende: ${(<IScreening>ticket.screening).endDate}`
        }, (err, info) => {
            console.log(err, info)
        });
    } catch (err) {console.error(err)}
    }

    static async sendReservationEmail(recipient: string, ticketIds: string[]) {
        try {
        let tickets = await Ticket.find({_id: {$in: ticketIds}}).populate({
            path: 'screening',
            populate: {
                path: 'movie',
                model: 'movies'
            }
        });
        if(!tickets) {
            console.log("ticket not found for email");
            return
        }
        let mailText: string = ``
        for(let ticket of tickets) {
            mailText += `Sie haben ein Ticket für den Film ${(<IScreening>ticket.screening).movie.title} reserviert.
            Vorstellungsstart: ${(<IScreening>ticket.screening).startDate}
            Vorstellungsende: ${(<IScreening>ticket.screening).endDate}
            `
        }
        await this.getNodeMailerTransporter().sendMail({
            to: recipient,
            subject: 'Ihre Reservierung',
            text: mailText
        });
    } catch (err) {console.error(err)}
    }

    static async sendBookingEmail(recipient: string, ticketIds: string[]) {
        try {
        let tickets = await Ticket.find({_id: {$in: ticketIds}}).populate({
            path: 'screening',
            populate: {
                path: 'movie',
                model: 'movies'
            }
        });
        if(!tickets) {
            console.log("ticket not found for email");
            return
        }
        let mailText: string = ``
        for(let ticket of tickets) {
            mailText += `Sie haben ein Ticket für den Film ${(<IScreening>ticket.screening).movie.title} gebucht.
            Vorstellungsstart: ${(<IScreening>ticket.screening).startDate}
            Vorstellungsende: ${(<IScreening>ticket.screening).endDate}
            `
        }
        await this.getNodeMailerTransporter().sendMail({
            to: recipient,
            subject: 'Ihre Bestellung',
            text: mailText
        });
    } catch (err) {console.error(err)}
    }

    static registerBackGroundJobs() {
        cron.schedule('*/1 * * * *', async () => {
            //mark the tickets with no activity as available
            let ticketsToUnselect: ITicket[] = [];
            try {
                console.log('executing selectedTickets cleanup: ' + new Date());
                let tickets = await Ticket.find({ status: 'selected' });
                //filter tickets, that haven't been modified for 10 minutes or longer
                ticketsToUnselect = tickets.filter((ticket) => {
                    let ticketDate = new Date(ticket.updatedAt);
                    return Math.abs(ticketDate.getTime() - new Date().getTime()) >= 1000 * 60 * 10;
                });
                for (let ticket of ticketsToUnselect) {
                    await Ticket.findOneAndUpdate({ _id: ticket._id }, { status: 'available' }, { new: true });
                }
                console.log(`unselected ${ticketsToUnselect.length} tickets`);
            } catch (err) { console.error(err); }

            //remove all tickets from carts with no acitivity (now marked as available)
            try {
                let ticketsToUnselectIds = ticketsToUnselect.map(ticket => ticket._id);
                let cartsToFilter = await Cart.find({ tickets: { $in: ticketsToUnselectIds } }).populate('tickets');
                for (let cart of cartsToFilter) {
                    //@ts-ignore
                    let newTickets = cart.tickets.filter(ticket => ticket.status == 'selected');
                    //@ts-ignore
                    await Cart.findOneAndUpdate({ _id: cart._id }, { tickets: newTickets }, { new: true });
                }
            } catch (err) { console.error(err); }
        });

        cron.schedule('*/15 * * * *', async () => {
            try {
                let cutOffTime = new Date((new Date).getTime() - 1000 * 60 * 60 * 5);
                let cartsToDelete = await Cart.find({ updatedAt: { $lte: cutOffTime } });
                let cartsToDeleteIds = cartsToDelete.map(cart => cart._id);
                await Cart.deleteMany({ _id: { $in: cartsToDeleteIds }});
                console.log(`deleted ${cartsToDelete.length} carts during cleanup`)
            } catch (err) { console.error(); }
        });

        //cron.schedule('*/15 * * * *', async () => {
    /* deactivated until real screenings are in 
            try {
                let cutOffTime = new Date((new Date).getTime() + 1000 * 60 * 60 * 5);
                let ticketCandidates = await Ticket.find({ status: 'reserved' }).populate('screening');
                let ticketsToUnreserve = ticketCandidates.filter(ticket => (<IScreening>ticket.screening).startDate.getTime() < cutOffTime.getTime());
                let ticketsToUnreserveIds = ticketsToUnreserve.map(ticket => ticket._id);
                Ticket.updateMany({_id: {$in: ticketsToUnreserveIds}}, {status: 'available'}, null);                
            } catch (err) { console.error(); }
        });
        */
    }    
}