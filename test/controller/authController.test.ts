import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src';
import User from '../../src/models/User';

chai.use(chaiHttp);

const agent = chai.request.agent(app);

describe('AuthController Tests',
  () => {
    it('After login, if the user does not exist, we do not receive a valid token',
      (done) => {
        sinon.stub(User,
          'findOne').resolves(null);

        agent
          .post('/login')
          .field('username',
            'Magneto')
          .field('password',
            'brotherhood')
          .end(() => {
            expect(agent).to.not.have.cookie('token');
            sinon.restore();
            done();
          });
      });

    it('After login, if the user exists and password is incorrect, we do not receive a valid token',
      (done) => {
        const goodUser = new User({ username: 'ProfessorX', password: 'xmen', email: 'charles@xavier.net' });
        sinon.stub(User,
          'findOne').resolves(goodUser);

        agent
          .post('/login')
          .field('username',
            'ProfessorX')
          .field('password',
            'brotherhood')
          .end(() => {
            expect(agent).to.not.have.cookie('token');
            sinon.restore();
            done();
          });
      });

    it('After login, if the user exists and password is correct, we receive a valid token',
      (done) => {
        const goodUser = new User({ username: 'ProfessorX', password: 'xmen', email: 'charles@xavier.net' });
        sinon.stub(User,
          'findOne').resolves(goodUser);

        agent
          .post('/login')
          .field('username',
            'ProfessorX')
          .field('password',
            'xmen')
          .end(() => {
            expect(agent).to.have.cookie('token');
            sinon.restore();
            done();
          });
      });
  });
