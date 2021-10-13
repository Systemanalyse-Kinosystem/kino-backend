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
import fs from "fs";
import ejs from "ejs";
import path from "path";

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
            if (!ticket) {
                console.log("ticket not found for email");
                return
            }
            let tickets = [ticket];

            let ticketsWithPrice = tickets.map((ticket: any) => {
                ticket = ticket.toObject();
                ticket.price = ticket.seat.type == "parquet" ? "10 €" : "12 €";
                return ticket;
            });
            ejs.renderFile(path.join(__dirname, "../mail_template/index.html"), { tickets: ticketsWithPrice, mailtype: "Bezahlte Tickets" }, async (err, htmlText) => {
                if (err) { return console.error(err) }
                await this.getNodeMailerTransporter().sendMail({
                    to: recipient,
                    subject: 'CineMy - Du hast erfolgreich ein Ticket bezahlt',
                    html: htmlText,
                    attachments: [{
                        filename: 'image-1.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-1.jpeg"),
                        cid: 'image-1'
                    },
                    {
                        filename: 'image-2.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-2.png"),
                        cid: 'image-2'
                    },
                    {
                        filename: 'image-3.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-3.png"),
                        cid: 'image-3'
                    },
                    {
                        filename: 'image-4.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-4.jpeg"),
                        cid: 'image-4'
                    },
                    {
                        filename: 'image-5.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-5.png"),
                        cid: 'image-5'
                    },
                    {
                        filename: 'image-6.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-6.jpeg"),
                        cid: 'image-6'
                    },
                    {
                        filename: 'image-7.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-7.jpeg"),
                        cid: 'image-7'
                    },
                    {
                        filename: 'image-8.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-8.jpeg"),
                        cid: 'image-8'
                    }]
                });
            });
        } catch (err) { console.error(err) }
    }

    static async sendReservationEmail(recipient: string, ticketIds: string[]) {
        try {
            let tickets = await Ticket.find({ _id: { $in: ticketIds } }).populate({
                path: 'screening',
                populate: {
                    path: 'movie',
                    model: 'movies'
                }
            });
            if (!tickets) {
                console.log("ticket not found for email");
                return
            }

            let ticketsWithPrice = tickets.map((ticket: any) => {
                ticket = ticket.toObject();
                ticket.price = ticket.seat.type == "parquet" ? "10 €" : "12 €";
                return ticket;
            });
            
            ejs.renderFile(path.join(__dirname, "../mail_template/index.html"), { tickets: ticketsWithPrice, mailtype: "Details zu deiner Reservierung" }, async (err, htmlText) => {
                if (err) { return console.error(err) }
                await this.getNodeMailerTransporter().sendMail({
                    to: recipient,
                    subject: 'CineMy - Du hast erfolgreich Tickets reserviert',
                    html: htmlText,
                    attachments: [{
                        filename: 'image-1.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-1.jpeg"),
                        cid: 'image-1'
                    },
                    {
                        filename: 'image-2.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-2.png"),
                        cid: 'image-2'
                    },
                    {
                        filename: 'image-3.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-3.png"),
                        cid: 'image-3'
                    },
                    {
                        filename: 'image-4.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-4.jpeg"),
                        cid: 'image-4'
                    },
                    {
                        filename: 'image-5.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-5.png"),
                        cid: 'image-5'
                    },
                    {
                        filename: 'image-6.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-6.jpeg"),
                        cid: 'image-6'
                    },
                    {
                        filename: 'image-7.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-7.jpeg"),
                        cid: 'image-7'
                    },
                    {
                        filename: 'image-8.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-8.jpeg"),
                        cid: 'image-8'
                    }]
                });
            });
        } catch (err) { console.error(err) }
    }

    static async sendBookingEmail(recipient: string, ticketIds: string[]) {
        try {
            let tickets = await Ticket.find({ _id: { $in: ticketIds } }).populate({
                path: 'screening',
                populate: {
                    path: 'movie',
                    model: 'movies'
                }
            });
            if (!tickets) {
                console.log("ticket not found for email");
                return
            }
            let ticketsWithPrice = tickets.map((ticket: any) => {
                ticket = ticket.toObject();
                ticket.price = ticket.seat.type == "parquet" ? "10 €" : "12 €";
                return ticket;
            });

            ejs.renderFile(path.join(__dirname, "../mail_template/index.html"), { tickets: ticketsWithPrice, mailtype: "Details zu deiner Buchung" }, async (err, htmlText) => {
                if (err) { return console.error(err) }
                await this.getNodeMailerTransporter().sendMail({
                    to: recipient,
                    subject: 'CineMy - Du hast erfolgreich Tickets gebucht!',
                    html: htmlText,
                    attachments: [{
                        filename: 'image-1.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-1.jpeg"),
                        cid: 'image-1'
                    },
                    {
                        filename: 'image-2.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-2.png"),
                        cid: 'image-2'
                    },
                    {
                        filename: 'image-3.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-3.png"),
                        cid: 'image-3'
                    },
                    {
                        filename: 'image-4.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-4.jpeg"),
                        cid: 'image-4'
                    },
                    {
                        filename: 'image-5.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-5.png"),
                        cid: 'image-5'
                    },
                    {
                        filename: 'image-6.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-6.jpeg"),
                        cid: 'image-6'
                    },
                    {
                        filename: 'image-7.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-7.jpeg"),
                        cid: 'image-7'
                    },
                    {
                        filename: 'image-8.jpeg',
                        path: path.join(__dirname, "../mail_template/images/image-8.jpeg"),
                        cid: 'image-8'
                    }]
                });
            });

        } catch (err) { console.error(err) }
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
                let cutOffTime = new Date((new Date).getTime() - 1000 * 60 * 60 * 24 * 10);
                let cartsToDelete = await Cart.find({ updatedAt: { $lte: cutOffTime } });
                let cartsToDeleteIds = cartsToDelete.map(cart => cart._id);
                await Cart.deleteMany({ _id: { $in: cartsToDeleteIds } });
                console.log(`deleted ${cartsToDelete.length} carts during cleanup`)
            } catch (err) { console.error(err); }
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