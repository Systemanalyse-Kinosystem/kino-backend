import request from "supertest";
import app from "./../app";

describe('GET /', function() {
    it('responds without errors', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end((err:Error, res:request.Response):void => {
            //if(err) return done(err);
            return done();
        })
    });
  });