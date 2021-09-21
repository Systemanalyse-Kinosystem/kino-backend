import app from "../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";
import User from "../api/models/user.model";
import { CallbackError } from "mongoose";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import IUser from "../api/interfaces/user.interface";
import bcrypt from "bcrypt"
import utils from "../api/utils/utils"

chai.use(chaiHttp)
let should = chai.should()

let customerToken: string;
let customerID: string;
let adminToken: string;
let adminID: string;

describe('Customer Routes', function () {
  let name = uniqueNamesGenerator({ dictionaries: [names] })
  this.timeout(5000)
  beforeEach('create and login admins and customers',(done) => {
    User.create({
      firstName: "TestAdminfromChai",
      lastName: "chaiAdmin",
      email: "chai@kinosystem.de",
      password: bcrypt.hashSync("test1234", 10),
      role: "admin",
      address: {
        street: "Teststraße 15",
        postalCode: "25980",
        city: "Sylt",
        country: "Germany"
      }
    }, (err: CallbackError | null, user: IUser | null) => {
      if (err || !user) { return done(err) }


      //create JWT Admintoken
      User.findOne({ email: "chai@kinosystem.de" }, "+password", {}, (err: CallbackError | null, user: IUser | null) => {
        if (err) { return done(err); }
        if (!user) { return done(new Error("No User with this email")) }
        adminID = user._id;
        adminToken = utils.createToken(user).token;

        //create dummy user
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
            return done();
          });
        });
      });
    });
  });

  afterEach('delete the dummy users', (done) => {
    User.findOneAndDelete({ _id: customerID }, {}, (err: CallbackError) => {
      User.findOneAndDelete({ _id: adminID }, {}, (err2: CallbackError) => {
        if (err) { return done(err); }
        if (err2) { return done(err2); }
        done();
      })
    })
  })

  //get the function and call it with (done)
  it('returns a list of customers', (done) => {
    testUtils.getDocumentListTest('/customer', adminToken, 10)(done)
  });

  it('returns a single customer', (done) => {
    testUtils.getDocumentSingleTest('/customer', adminToken, customerID, 'role','firstName', 'lastName', 'email')(done)
  })

  it('registers a customer', function (done) {
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

        //checks if user was created
        User.findOne({ _id: createdID }, (err: CallbackError, user: IUser) => {
          if (user.firstName != name || user.email != name + '@kinosystem.de' || err) { return done(new Error("User was not created (correctly)")) }
          User.findOneAndDelete({ _id: res.body._id }, {}, (err: CallbackError) => {
            if (err) { return done(err); }
            done();
          })
        })

        //delete the created user

      });
  });

  it('returns the logged in customer', function (done) {
    chai.request(app)
      .get('/api/v1/customer/me')
      .set('auth', customerToken)
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        return done();
      })
  });

  it('updates a user', function (done) {
    chai.request(app)
      .put('/api/v1/customer/' + customerID)
      .set('auth', adminToken)
      .send({
        firstName: name + " renamed"
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err); }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('firstName').equal(name + ' renamed')
        //check if user was updated
        User.findOne({ _id: customerID }, (err: CallbackError, user: IUser) => {
          if (user.firstName != name + ' renamed') { return done(new Error("User was not updated (correctly)")) }
          done();
        })
      })
  });

  it('updates the logged in customer', function (done) {
    chai.request(app)
      .put('/api/v1/customer/me')
      .set('auth', customerToken)
      .send({
        firstName: name + ' renamed'
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err); }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('firstName').equal(name + ' renamed')
        return done();
      })
  });

  it('deletes a customer', (done) => {
    chai.request(app)
      .delete('/api/v1/customer/' + customerID)
      .set('auth', adminToken)
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err); }
        res.should.have.status(204)
        User.findOne({ _id: customerID }, (err: CallbackError, user: IUser) => {
          if (user) { return done(new Error("User was not deleted")) }
          done();
        })
      })
  })
});









