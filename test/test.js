const chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

// Npm packages and some urls for test functions
const app = 'http://localhost:3000';

describe("First test", () => {
  /*it("should return true for a number in between 10 and 70", () => {
    expect(functions.exampleTest(39)).to.be.true;
  })*/
  it("`/GET Account`. Make post request for account datas. Return with account array", (done) => {
    chai.request(app)
    .get('/test/accounts')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      res.body.should.be.a('array');
      done();
    });
  })

  it("`/POST` Make post request. Return with 200 status code", (done) => {
    chai.request(app)
    .post('/test/status')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  })

  it("`/POST Account`. Make post request for DataBase. Return with recorded data", (done) => {
    chai.request(app)
    .post('/test/accounts/addData')
    const data = {
      name: 'testAccount',
      surname: 'testAccount',
      username: 'testAccount',
      password: 'testAccount'
    }
    .field(data)
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  })
});
