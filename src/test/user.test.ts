import app from "./../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";

chai.use(chaiHttp)
let should = chai.should()

let userToken: string;
let userID: string;
let adminToken: string;

describe('User Lifecycle', function () {
  this.timeout(5000)
  before('Login Admin, Login User',(done) => {

    chai.request(app)
      .post('/api/v1/login')
      .set('content-type', 'application/json')
      .send({
        email: "admin",
        password: "test1234",
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(200)
        adminToken = res.body.token.token;
      });

    chai.request(app)
      .post('/api/v1/login')
      .send({
        email: "user",
        password: "test1234",
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(200)
        userToken = res.body.token.token;
        return done();
      });
  })

  it('creates a user', function (done) {
    chai.request(app)
      .post('/api/v1/user')
      .set('auth', adminToken)
      .send({
        name: "Supertest-User",
        email: "supertest-user@kinosystem.de",
        password: "test1234"
      })
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('name').equal('Supertest-User')
        res.body.should.have.property('email').equal('supertest-user@kinosystem.de')
        userID = res.body.id;
        done();
      })

  });

  //like this, because if the testUtils function is passed directly, 
  //it gets evaluated when adminToken is still undefined
  //get the function and call it with (done)
  it('returns a list of users', (done) => {
    testUtils.getDocumentListTest('/user', adminToken)(done)
  });

  it('returns a single user', (done) => {
    testUtils.getDocumentSingleTest('/user', adminToken, userID)(done)
  })

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
        return done();
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
        done();
        //get document from database and check that it is deleted
      })
  })
});







