import app from "../app";
import chai from "chai"
import chaiHttp from "chai-http";
import { CallbackError } from "mongoose";
import IUser from "../api/interfaces/user.interface";
import User from "../api/models/user.model";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import bcrypt from "bcrypt";

chai.use(chaiHttp)
let should = chai.should()
let userID: string;

describe('Authentication Routes', function () {
    this.timeout(5000);
    let name = uniqueNamesGenerator({ dictionaries: [names] })
    before('create a dummy user', (done) => {
        User.create({
            firstName: name,
            lastName: name,
            email: name + "@kinosystem.de",
            password: bcrypt.hashSync("test1234", 10),
            role: "user",
            address: {
                street: "Teststraße 15",
                postalCode: "25980",
                city: "Sylt",
                country: "Germany"
            }
        }, (err: CallbackError | null, user: IUser | null) => {
            if (err || !user) { return done(err) }
            userID = user._id;
            done();
        });
    });

    afterEach('delete the dummy user', (done) => {
        User.findOneAndDelete({ _id: userID }, {}, (err: CallbackError) => {
            if (err) { return done(err); }
            done();
        });
    });


    it('logs in a user', (done) => {
        chai.request(app)
            .post('/api/v1/login')
            .send({
                email: name + "@kinosystem.de",
                password: "test1234"
            })
            .end((err: Error, res: ChaiHttp.Response): void => {
                if (err) { return done(err) }
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.token.should.have.property('expiresIn');
                res.body.token.should.have.property('token');
                done();
            });
    });

    it('registers a customer', (done) => {
        let name = uniqueNamesGenerator({ dictionaries: [names] })
        chai.request(app)
            .post('/api/v1/register')
            .send({
                firstName: name,
                lastName: name,
                email: name + "@kinosystem.de",
                password: "test1234",
                address: {
                    street: "Teststraße 15",
                    postalCode: "25980",
                    city: "Sylt",
                    country: "Germany"
                }
            })
            .end((err: Error, res: ChaiHttp.Response): void => {
                if (err) { return done(err) }
                res.should.have.status(201)
                res.body.should.be.a('object');
                res.body.should.have.property('firstName').equal(name);
                res.body.should.have.property('email').equal(name + '@kinosystem.de');
                let createdID = res.body._id

                //checks if customer was created
                User.findOne({ _id: createdID, role: 'customer' }, (err: CallbackError, user: IUser) => {
                    if (user.firstName != name || user.email != name + '@kinosystem.de' || err) { return done(new Error("Customer was not created (correctly)")) }
                    User.findOneAndDelete({ _id: res.body._id }, {}, (err: CallbackError) => {
                        if (err) { return done(err); }
                        done();
                    });
                });
            });
    });
});

