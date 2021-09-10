import request from "supertest";
import app from "../app";
import axios from 'axios'

let userToken: string;
let userID: string;
let adminToken: string;

before((done) => {
  request(app)
    .post('/api/v1/login')
    .send({
      email: "user",
      password: "test1234",
    })
    .end((err: Error, response: request.Response) => {
      if (err) { return done(err) }
      userToken = response.body.token.token;
      request(app)
        .post('/api/v1/login')
        .send({
          email: "admin",
          password: "test1234",
        })
        .end((err: Error, response: request.Response) => {
          if (err) { return done(err) }
          adminToken = response.body.token.token;
          done();
        });
    });
})


describe('User Lifecycle', function () {
  it('creates a user', function (done) {
    request(app)
      .post('/api/v1/user')
      .set('auth', adminToken)
      .send({
        name: "Supertest-User",
        email: "supertest-user@kinosystem.de",
        password: "test1234"
      })
      .expect(201)
      .expect(res => {
        res.body.name = "Supertest-User",
          res.body.email = "supertest-user@kinosystem.de"
      })
      .end((err: Error, res: request.Response): void => {
        userID = res.body.id;
        if (err) { return done(err); }
        return done();
      })

  });
  it('deletes a user', (done) => {
    request(app)
      .delete('/api/v1/user/' + userID)
      .set('auth', adminToken)
      .expect(204)
      .end((err: Error, res: request.Response): void => {
        if (err) { return done(err); }
        return done();
      })
  })
});
/*
describe('GET /user', function () {
  it('returns a list of users', function (done) {
    request(app)
      .get('/api/v1/register')
      .set('Authorization', userToken)
      .expect(200)
      .end((err: Error, res: request.Response): void => {
        if (err) { done(err); }
        return done();
      })
  });
});

describe('GET /user/:id', function () {
  it('returns a single user', function (done) {
    request(app)
      .get('/api/v1/register')
      .set('Authorization', userToken)
      .expect(200)
      .end((err: Error, res: request.Response): void => {
        if (err) { done(err); }
        return done();
      })
  });
});

describe('GET /user/me', function () {
  it('returns the logged in user', function (done) {
    request(app)
      .get('/api/v1/register')
      .set('Authorization', userToken)
      .expect(200)
      .end((err: Error, res: request.Response): void => {
        if (err) { done(err); }
        return done();
      })
  });
});


describe('PUT /user/:id', function () {
  it('updates a user', function (done) {
    request(app)
      .get('/api/v1/register')
      .set('Authorization', userToken)
      .expect(200)
      .end((err: Error, res: request.Response): void => {
        if (err) { done(err); }
        return done();
      })
  });
});

describe('PUT /user/me', function () {
  it('updates the logged in user', function (done) {
    request(app)
      .get('/api/v1/register')
      .set('Authorization', userToken)
      .expect(200)
      .end((err: Error, res: request.Response): void => {
        if (err) { done(err); }
        return done();
      })
  });
});
*/
/*
after((done) => {
    request(app)
      .delete('/api/v1/user/' + userID)
      .set('auth', adminToken)
      .expect(204)
      .end((err: Error, res: request.Response): void => {
        if (err) { return done(err); }
        return done();
      })
});
*/

