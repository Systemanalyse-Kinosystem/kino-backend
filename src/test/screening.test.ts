import app from "../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";
import { CallbackError } from "mongoose";
import Screening from "../api/models/screening.model";
import Movie from "../api/models/movie.model";
import IScreening from "../api/interfaces/screening.interface";

chai.use(chaiHttp)
let should = chai.should()

describe('Screening Routes', function () {
  this.timeout(5000)

  //get the function and call it with (done)
  it('returns a list of screenings', (done) => {
    testUtils.getDocumentListTest('/screening', "", 10)(done)
  });

  it('returns a single screening', (done) => {
    Screening.findOne((err: CallbackError, screening: IScreening) => {
      if (err) { return done(err); }
      testUtils.getDocumentSingleTest('/screening', "", screening._id)(done)
    })
  })

  it('returns a list of screenings for a specific movie', (done) => {
    Movie.findOne((err: CallbackError, movie: any) => {
      if (err) { return done(err); }
      Screening.create({
        movie: movie._id,
        hall: "61409762e10a26011c57d669",
        startDate: "1631722770000",
        endDate: "1631723770000"
      }, (err: CallbackError, screening: IScreening) => {
        if (err) { return done(err); }

        chai.request(app)
          .get('/api/v1/screening/movie/' + movie._id)
          .end((err: Error, res: ChaiHttp.Response): void => {
            if (err) { return done(err) }
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.should.have.lengthOf.below(11)
            for(let screening of res.body) {
              screening.movie.should.have.property('_id').equal(movie._id.toString());
          }
            done();
          });

      });
    })
  })
});
