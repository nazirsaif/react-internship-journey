import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js'; // Ensure this path is correct

const { expect } = chai;
chai.use(chaiHttp);

describe('User Signup', () => {
  it('should register a new user', (done) => {
    chai.request(server)
      .post('/signup')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'Test1234'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').eql('User registered successfully');
        done();
      });
  });
});
