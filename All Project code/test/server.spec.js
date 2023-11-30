// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
const bcrypt = require('bcrypt');
// Importing libraries


// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;


describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });


  // ===========================================================================
  // TO-DO: Part A Login unit test case
  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
//Positive cases


it('positive : /add_user', done => {
  chai
    .request(server)
    .post('/add_user')
    .send({id: 5, name: 'John Doe', dob: '2020-02-20'})
    .end((err, res) => {
      expect(res).to.have.status(500);
      expect(res.body.message).to.equals('Success');
      done();
    });
});
});


it('positive: /login', async () => {
  const hash = await bcrypt.hash('jerry', 10); //using hashed password


  chai
    .request(server)
    .post('/login')
    .send({ username: 'jerry', password: hash })
    .end((err, res) => {
      expect(res).to.have.status(200);
      if (res.redirects && res.redirects.length > 0)
      {
        expect(res.redirects[0]).to.equal('/home');
      }
    });
});


it('Negative: /login invalid password', async () => {
  chai
    .request(server)
    .post('/login')
    .send({ username: 'jerry', password: 'invalid'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      if (res.redirects && res.redirects.length > 0)
      {
      expect(res.redirects[0]).to.equal('/login');
      }
    });
});


/*need to delete New User if exists
it('positive : /register', done => {
  chai


    .request(server)
    .post('/register')
    .send({username: 'New User', password: '123'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.redirects[0]).to.equal('/login');
      done();
    });
});




it('negative : /register', done => {
  chai
    .request(server)
    .post('/register')
    .send({username: 'New User', password: '23o23o32invalid'})
    .end((err, res) => {
      expect(res).to.have.status(400);
      done();
    });
});
*/












//We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 200 along with a "Invalid input" message.
it('Negative : /add_user. Checking invalid name', done => {
  chai
    .request(server)
    .post('/add_user')
    .send({id: '5', name: 10, dob: '2020-02-20'})
    .end((err, res) => {
      expect(res).to.have.status(500);
      expect(res.body.message).to.equals('Success');
      done();
    });
});
