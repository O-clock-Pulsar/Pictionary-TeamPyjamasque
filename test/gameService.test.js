const should = require('chai');
const Container = require('typedi');
const GameService = require('./src/services/GameService');

const IGameServiceResult = rewire('src/Interfaces/GameService');

/*
 * import { should } from 'chai';
 * import {Container } from 'typedi';
 * import GameService from './src/services/GameService';
 */


// chai.use(require('chai-interface'));

const gameService = Container.get(GameService);

describe('',
  () => {
    it('Game service\'s createGame returns an object with IGameServiceResult interface',
      () => {
        const result = gameService.createGame('Stan Lee');
        expect(result).to.be.an('object');
      });
  });
