import app from "./../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";
import User from "../api/models/user.model";
import { CallbackError } from "mongoose";
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import IUser from "../api/interfaces/user.interface";

chai.use(chaiHttp)
let should = chai.should()

let userToken: string;
let userID: string;
let adminToken: string;

describe('User Lifecycle', function () {
  this.timeout(5000)
  beforeEach('Login Admin, create Test-User, login Test-User', (done) => {
    let name = uniqueNamesGenerator({ dictionaries: [names] })
    //login admin
    chai.request(app)
      .post('/api/v1/login')
      .send({
        email: "admin",
        password: "test1234",
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(200)
        adminToken = res.body.token.token;

        //create dummy user
        chai.request(app)
          .post('/api/v1/user')
          .set('auth', adminToken)
          .send({
            name: name,
            email: name + "@kinosystem.de",
            password: "test1234"
          })
          .end((err: Error, res: ChaiHttp.Response): void => {
            if (err) { return done(err) }
            res.should.have.status(201)
            res.body.should.be.a('object');
            res.body.should.have.property('name').equal(name);
            res.body.should.have.property('email').equal(name + '@kinosystem.de');
            userID = res.body.id;

            //login dummy user
            chai.request(app)
              .post('/api/v1/login')
              .send({
                email: name + "@kinosystem.de",
                password: "test1234",
              })
              .end((err: Error, res: ChaiHttp.Response): void => {
                if (err) { return done(err) }
                res.should.have.status(200)
                userToken = res.body.token.token;
                return done();
              });
          });
      });

  });

  afterEach('delete the dummy user', (done) => {
    User.deleteOne({ id: userID }, {}, (err: CallbackError) => {
      if(err) {return done(err);}
      done();
    })
  })

  //get the function and call it with (done)
  it('returns a list of users', (done) => {
    testUtils.getDocumentListTest('/user', adminToken)(done)
  });

  it('returns a single user', (done) => {
    testUtils.getDocumentSingleTest('/user', adminToken, userID)(done)
  })

  it('creates a user', function (done) {
    let name = uniqueNamesGenerator({ dictionaries: [names] })
    chai.request(app)
      .post('/api/v1/user')
      .set('auth', adminToken)
      .send({
        name: name,
        email: name + '@kinosystem.de',
        password: "test1234"
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(201)
        res.body.should.be.a('object');
        res.body.should.have.property('name').equal(name);
        res.body.should.have.property('email').equal(name+'@kinosystem.de');
        userID = res.body._id

        //checks if user was created
        User.findOne({_id: userID}, (err: CallbackError, user: IUser) => {
          if(user.name != name || user.email != name+'@kinosystem.de') {return done(new Error("User was not created"))}
          User.findOneAndDelete({ id: res.body._id }, {}, (err: CallbackError) => {
            if (err) { return done(err); }
            done();
          })
        })

        //delete the created user
        
      });
  });

  it('returns the logged in user', function (done) {
    chai.request(app)
      .get('/api/v1/user/me')
      .set('auth', userToken)
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        return done();
      })
  });

  it('updates a user', function (done) {
    chai.request(app)
      .put('/api/v1/user/' + userID)
      .set('auth', adminToken)
      .send({
        name: "Supertest-User renamed"
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err); }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('name').equal('Supertest-User renamed')
        //check if user was updated
        User.findOne({_id: userID}, (err: CallbackError, user: IUser) => {
          if(user.name != 'Supertest-User renamed') {return done(new Error("User was not updated"))}
          done();
        })
      })
  });

  it('updates the logged in user', function (done) {
    chai.request(app)
      .put('/api/v1/user/me')
      .set('auth', userToken)
      .send({
        name: "Test-User"
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err); }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('name').equal('Test-User')
        return done();
      })
  });

  it('deletes a user', (done) => {
    chai.request(app)
      .delete('/api/v1/user/' + userID)
      .set('auth', adminToken)
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err); }
        res.should.have.status(204)
        User.findOne({_id: userID}, (err: CallbackError, user: IUser) => {
          if(user) {return done(new Error("User was not deleted"))}
          done();
        })
      })
  })
});









