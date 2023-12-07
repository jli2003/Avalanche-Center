// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
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
});


//------------------------------------------REGISTER TEST CASES---------------------------------------\\
describe('Register', () => {
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'NewUser', password: '123'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('negative : /register user already exists', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'NewUser', password: 'invalid'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  })

});



//------------------------------------------LOGIN & LOGOUT TEST CASES---------------------------------------\\
describe('Login', () => {
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'NewUser', password: '123'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('negative : /login invalid password', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'NewUser', password: 'bob'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  
  it('negative : /login user unknown', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'UseriesciscesINVALID', password: 'bob'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });


  it('positive : /logout successful', done => {
    chai
    .request(server)
    .get('/logout')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });


  //------------------------------------------DELETE USERS TEST CASES---------------------------------------\\
});

describe('Delete', () => {
  it('positive: /delete_user', (done) => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'NewUser', password: '123' })
      .end((loginErr, loginRes) => {
        expect(loginRes).to.have.status(200);

        chai
          .request(server)
          .delete('/delete_user')
          .query({ username: 'NewUser' }) // Use query() for passing parameters in DELETE requests
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it('negative: /delete_user user does not exist', (done) => {
    chai
      .request(server)
      .delete('/delete_user')
      .query({ username: 'escensceINVALID' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});


//------------------------------------------HOME & ADMIN TEST CASES---------------------------------------\\
/*
describe('Admin', () => {
  it('positive : /adminControls', done => {
    chai
      .request(server)
      .get('/adminControls')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('positive : Home Page Update', done => {
    chai
      .request(server)
      .post('/admin/updateHome')
      .send({imagePath: 'https://m.media-amazon.com/images/M/MV5BZDE2ZjIxYzUtZTJjYS00OWQ0LTk2NGEtMDliYmI3MzMwYjhkXkEyXkFqcGdeQWFsZWxvZw@@._V1_.jpg', dangerRating: 'HIGH', avalancheType: 'wind slab', synopsis: 'shrek'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

}); */


