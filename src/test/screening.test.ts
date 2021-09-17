import app from "../app";
import testUtils from "./testUtils";
import chai from "chai"
import chaiHttp from "chai-http";
import { CallbackError } from "mongoose";
import Screening from "../api/models/screening.model";

chai.use(chaiHttp)
let should = chai.should()

describe('Screening Routes', function () {
  this.timeout(5000)

  //get the function and call it with (done)
  it('returns a list of screenings', (done) => {
    testUtils.getDocumentListTest('/screening', "", 10)(done)
  });

  it('returns a single screening', (done) => {
    Screening.findOne((err: CallbackError, screening: any) => {
      if (err) { return done(err); }
      testUtils.getDocumentSingleTest('/screening', "", screening._id)(done)
    })
  })
});
