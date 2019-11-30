import chai, { expect } from 'chai';
import { Container } from 'typedi';
import sinon from 'sinon';
import GameService from '../../src/services/GameService';
import Game from '../../src/models/Game';

chai.use(require('chai-interface'));

const gameService = Container.get(GameService);

describe('GameService Tests',
  () => {
    it('Game service\'s createGame returns an object with an IGameServiceResult interface',
      async () => {
        sinon.stub(Game.prototype,
          'save').returnsThis();

        const result = await gameService.createGame('Stan Lee');

        expect(result).to.have.interface({
          game: {
            host: String,
            players: [String],
            namespace: String,
            date: Date,
            library_id: Number,
          },
          alreadyExists: Boolean,
          message: String,
          namespace: String,
        });
        sinon.restore();
      });
  });
