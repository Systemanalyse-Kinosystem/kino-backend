import app from "../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";
import { CallbackError } from "mongoose";
import Movie from "../api/models/movie.model";

chai.use(chaiHttp)
let should = chai.should()

describe('Movie Routes', function () {
  this.timeout(5000)

  //get the function and call it with (done)
  it('returns a list of movies with count', (done) => {
    chai.request(app)
      .get('/api/v1/movie' + '?perPage=10')
      .end((err: Error, res: ChaiHttp.Response): void => {
        if (err) { return done(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.movies.should.have.lengthOf.below(11)

        res.body.should.have.property('movies');
        res.body.should.have.property('count');


        done();
      })
  });


  it('returns a single movie', (done) => {
    Movie.findOne((err: CallbackError, movie: any) => {
      if (err) { return done(err); }
      testUtils.getDocumentSingleTest('/movie', "", movie._id, 'title')(done)
    })
  })
});
