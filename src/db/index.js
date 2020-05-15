import createMatch from './createMatch.js';
import concludeMatch from './concludeMatch.js';
import getPlayer from './getPlayer.js';
import playerInBattle from './playerInBattle.js';
import getActiveMatch from './getActiveMatch.js';
import setPlayerRating from './setPlayerRating.js';

const CREATE_MATCH = 'CREATE_MATCH';
const CONCLUDE_MATCH = 'CONCLUDE_MATCH';
const GET_PLAYER = 'GET_PLAYER';
const GET_ACTIVE_MATCH = 'GET_ACTIVE_MATCH';
const PLAYER_IN_BATTLE = 'PLAYER_IN_BATTLE';
const SET_PLAYER_RATING = 'SET_PLAYER_RATING';

export default {
  [CREATE_MATCH]: createMatch,
  [CONCLUDE_MATCH]: concludeMatch,
  [GET_PLAYER]: getPlayer,
  [GET_ACTIVE_MATCH]: getActiveMatch,
  [PLAYER_IN_BATTLE]: playerInBattle,
  [SET_PLAYER_RATING]: setPlayerRating,
};
