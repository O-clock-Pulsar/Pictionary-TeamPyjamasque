import chai, { expect } from 'chai';
import { Container } from 'typedi';
import sinon from 'sinon';
import UserService from '../../src/services/UserService';
import User from '../../src/models/User';

const userService = Container.get(UserService);

// Copied from game service tests so it might need other changes
describe('UserService Tests',
  () => {
    it('User service\'s createUser does not create a User if it does not have all the required information',
      async () => {
        sinon.stub(User.prototype,
          'save').returnsThis();

        const result = await userService.createUser({
          username: 'YourMom', email: 'yourmom@yourmom.com', password: 'ok', confirmation: '',
        });
        expect(result).to.have.property('error',
          true);
        sinon.restore();
      });
  });
