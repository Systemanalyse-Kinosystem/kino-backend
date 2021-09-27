import app from "../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";
import { CallbackError } from "mongoose";
import Movie from "../api/models/movie.model";
import Ticket from "../api/models/ticket.model";
import Cart from "../api/models/cart.model";
import ICart, { ICartNotPopulated } from "../api/interfaces/cart.interface";
import ITicket from "../api/interfaces/ticket.interface";
import Screening from "../api/models/screening.model";
import IScreening from "../api/interfaces/screening.interface";
import User from "../api/models/user.model";
import IUser from "../api/interfaces/user.interface";
import bcrypt from "bcrypt";
import utils from "../api/utils/utils";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

chai.use(chaiHttp)
let should = chai.should()

describe('Ticket Routes', function () {
    let ticketIds: any = [];
    let cartId = "";
    let customerID = "";
    let customerToken = "";
    let name = uniqueNamesGenerator({ dictionaries: [names] })
    this.timeout(5000)
    before('setup: create tickets and cart', (done) => {

        //create dummy customer
        User.create({
            firstName: name,
            lastName: name,
            email: name + "@kinosystem.de",
            password: bcrypt.hashSync("test1234", 10),
            role: "customer",
            address: {
                street: "Teststraße 15",
                postalCode: "25980",
                city: "Sylt",
                country: "Germany"
            }
        }, (err: CallbackError | null, user: IUser | null) => {
            if (err || !user) { return done(err) }

            User.findOne({ email: name + "@kinosystem.de" }, "+password", {}, (err: CallbackError | null, user: IUser | null) => {
                if (err) { return done(err); }
                if (!user) { return done(new Error("No User with this email")) }
                customerToken = utils.createToken(user).token;
                customerID = user._id;

                //create dummy cart
                Cart.create({}, (err: CallbackError, cart: ICartNotPopulated) => {
                    if (err) { return done(err); }
                    cartId = cart._id;

                    let ticketBodies = [
                        { status: 'available' },
                        { status: 'selected' },
                        { status: 'valid', userID: customerID },
                        { status: 'reserved' },
                        { status: 'reserved' },
                        { status: 'valid' }
                    ];
                    //create dummy Tickets
                    Ticket.insertMany(ticketBodies, {}, (err: CallbackError | null, res: any) => {
                        if (err) { return done(err); }
                        for (let ticket of res) {
                            ticketIds.push(ticket._id);
                        }
                        return done();
                    });
                });
            });
        });

    });

    after('teardown: delete tickets and other garbage', (done) => {
        Ticket.deleteMany({ _id: { $in: ticketIds } }, {}, (err: CallbackError | null) => {
            User.findOneAndDelete({ _id: customerID }, {}, (err2: CallbackError | null) => {
                Cart.findOneAndDelete({ _id: cartId}, {}, (err3: CallbackError | null) => {
                                   
                if (err) { return done(err); }
                if (err2) { return done(err2); }
                if (err3) { return done(err3); }
                done();
              });
            })
        });
    });

    //ticketIds: 0
    it('selects a ticket', (done) => {
        //check if ticket-status and cart are being updated
        chai.request(app)
            .put(`/api/v1/ticket/select/${ticketIds[0]}/${cartId}`)
            .end((err: Error, res: ChaiHttp.Response): void => {
                //check response
                if (err) { return done(err) }
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('status').equal('selected');
                //check Ticket in DB
                Ticket.findOne({ _id: ticketIds[0] }, (err: CallbackError, ticket: ITicket) => {
                    ticket.should.have.property('status').equal('selected');
                    //check Cart
                    Cart.findOne({ _id: cartId }, (err: CallbackError, cart: ICartNotPopulated) => {
                        if (err) { return done(err); }
                        if (!cart.tickets.includes(ticketIds[0])) {
                            return done("ticket not added to cart");
                        }
                        return done();
                    });
                });
            });
    });

    //ticketIds: 1
    it('unselects a ticket', (done) => {
        //check if ticket-status and cart are being updated
        chai.request(app)
            .put(`/api/v1/ticket/unselect/${ticketIds[1]}/${cartId}`)
            .end((err: Error, res: ChaiHttp.Response): void => {
                //check response
                if (err) { return done(err) }
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('status').equal('available');
                //check Ticket in DB
                Ticket.findOne({ _id: ticketIds[1] }, (err: CallbackError, ticket: ITicket) => {
                    ticket.should.have.property('status').equal('available');
                    //check Cart
                    Cart.findOne({ _id: cartId }, (err: CallbackError, cart: ICartNotPopulated) => {
                        if (err) { return done(err); }
                        if (cart.tickets.includes(ticketIds[1])) {
                            return done("ticket not removed from cart");
                        }
                        return done();
                    });
                });
            });
    });

    it('returns tickets for a specific screening', (done) => {
        Screening.findOne({}, (err: CallbackError, screening: IScreening) => {
            chai.request(app)
                .get(`/api/v1/ticket/screening/${screening._id}`)
                .end((err: Error, res: ChaiHttp.Response): void => {
                    if (err) { return done(err) }
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    for (let ticket of res.body) {
                        ticket.screening.should.have.property('_id').equal(screening._id.toString());
                    }
                    return done();
                });
        });
    });

    //ticketIds: 2
    it('returns tickets for the logged in user', (done) => {
        chai.request(app)
        .get('/api/v1/ticket/me')
        .set('auth', customerToken)
        .end((err: Error, res: ChaiHttp.Response): void => {
            if (err) { return done(err) }
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.lengthOf.above(0);
            for(let ticket of res.body) {
                ticket.should.have.property('userID').equal(customerID.toString());
            }
            return done();
        });
    })
    //ticketIds: 3
    it('pays a ticket', (done) => {
        chai.request(app)
        .put(`/api/v1/ticket/pay/${ticketIds[3]}`)
        .send({email: 'th9titanmail@gmail.com'})
        .end((err: Error, res: ChaiHttp.Response): void => {
            if(err)  {return done(err);}
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').equal('valid');
            Ticket.findOne({ _id: ticketIds[3]}, (err: CallbackError | null, ticket: ITicket) => {
                if(err || !ticket) {return done(err);}
                ticket.should.have.property('status').equal('valid');
                return done();
            });
        });
    });

    //ticketIds: 4
    it('unreserves a ticket', (done) => {
        chai.request(app)
        .put(`/api/v1/ticket/unreserve/${ticketIds[4]}`)
        .set('auth', customerToken)
        .end((err: Error, res: ChaiHttp.Response): void => {
            if(err)  {return done(err);}
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').equal('available');
            Ticket.findOne({ _id: ticketIds[4]}, (err: CallbackError | null, ticket: ITicket) => {
                if(err || !ticket) {return done(err);}
                ticket.should.have.property('status').equal('available');
                return done();
            });
        });
    });

    //ticketIds: 5
    it('invalidates a ticket', (done) => {
        chai.request(app)
        .put(`/api/v1/ticket/invalidate/${ticketIds[5]}`)
        .end((err: Error, res: ChaiHttp.Response): void => {
            if(err)  {return done(err);}
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').equal('invalid');
            Ticket.findOne({ _id: ticketIds[5]}, (err: CallbackError | null, ticket: ITicket) => {
                if(err || !ticket) {return done(err);}
                ticket.should.have.property('status').equal('invalid');
                return done();
            });
        });
    });
});
