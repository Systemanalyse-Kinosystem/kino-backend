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
  it('returns a list of movies', (done) => {
    testUtils.getDocumentListTest('/movie', "", 10)(done)
  });

  it('returns a single movie', (done) => {
    Movie.findOne((err: CallbackError, movie: any) => {
      if (err) { return done(err); }
      testUtils.getDocumentSingleTest('/movie', "", movie._id)(done)
    })
  })
});
