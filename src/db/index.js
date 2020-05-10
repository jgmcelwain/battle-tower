import createMatch from './createMatch.js';
import concludeMatch from './concludeMatch.js';
import getPlayer from './getPlayer.js';
import getAllPlayers from './getAllPlayers.js';
import getCurrentBattle from './getCurrentBattle.js';

const CREATE_MATCH = 'CREATE_MATCH';
const CONCLUDE_MATCH = 'CONCLUDE_MATCH';
const GET_PLAYER = 'GET_PLAYER';
const GET_ALL_PLAYERS = 'GET_ALL_PLAYERS';
const GET_CURRENT_BATTLE = 'GET_CURRENT_BATTLE';

export default {
  [CREATE_MATCH]: createMatch,
  [CONCLUDE_MATCH]: concludeMatch,
  [GET_PLAYER]: getPlayer,
  [GET_ALL_PLAYERS]: getAllPlayers,
  [GET_CURRENT_BATTLE]: getCurrentBattle,
};
