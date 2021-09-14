import app from "./../app";
import Mocha from "mocha";
import chai from "chai"
import chaiHttp from "chai-http";

chai.use(chaiHttp)
let should = chai.should()


export default class testUtils {
    static getDocumentListTest(route: string, token: string, perPage: number = 10) {
        return function (done: Mocha.Done) {
            chai.request(app)
                .get('/api/v1' + route + '?perPage=' + perPage)
                .set('auth', token)
                .end((err: Error, res: ChaiHttp.Response): void => {
                    if(err) {return done(err)}
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.should.have.lengthOf.below(perPage+1)
                    done();
                })
        }
    }

    //TODO retrieve random docID from database
    static getDocumentSingleTest(route: string, token: string, docID: string) {
        return function (done: Mocha.Done) {
            chai.request(app)
                .get('/api/v1' + route + '/' + docID)
                .set('auth', token)
                .end((err: Error, res: ChaiHttp.Response): void => {
                    if(err) {return done(err)}
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    done();
                })
        }
    }
}