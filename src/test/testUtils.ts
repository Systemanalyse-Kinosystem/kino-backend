import app from "./../app";
import Mocha from "mocha";
import chai from "chai"
import chaiHttp from "chai-http";

chai.use(chaiHttp)
let should = chai.should()


export default class testUtils {
    static getDocumentListTest(route: string, token: string) {
        return function (done: Mocha.Done) {
            chai.request(app)
                .get('/api/v1' + route)
                .set('auth', token)
                .end((err: Error, res: ChaiHttp.Response): void => {
                    if(err) {return done(err)}
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    done()
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