import IUser from "../interfaces/user.interface"
import { ITokenData, IDataStoredInToken } from "../interfaces/jwt.interface"
import jwt from "jsonwebtoken";
import cron from "node-cron";
import Ticket from "../models/ticket.model";
import ITicket from "../interfaces/ticket.interface";
import { CallbackError } from "mongoose";
import { ObjectId } from "bson";
import cartModel from "../models/cart.model";
import ICart from "../interfaces/cart.interface";

export default class UtilClass {

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

    static registerBackGroundJobs() {
        //look for selected tickets with no activity for 10 minutes every minute
        cron.schedule('*/1 * * * *', () => {
            console.log('executing selectedTickets cleanup: ' + new Date());
            Ticket.find({ status: 'selected' }, (err: CallbackError | null, tickets: ITicket[] | null) => {
                if (err || !tickets) {
                    return console.error(err);
                } else {
                    let ticketsToDelete = tickets.filter((ticket) => {
                        let ticketDate = new Date(ticket.updatedAt);
                        return Math.abs(ticketDate.getTime() - new Date().getTime()) >= 1000 * 60 * 10;
                    });
                    for (let ticket of ticketsToDelete) {
                        Ticket.findOneAndUpdate({ _id: ticket._id }, { status: 'available' }, { new: true }, (err: CallbackError | null) => {
                            if (err) { return console.error(err) }
                        });
                    }
                    console.log(`unselected ${ticketsToDelete.length} tickets`);
                }
            })
        });

        //remove unselected tickets from carts every minute
        //find carts with available tickets, filter their tickets Array

    }
}