import db from '../../db/index.js';
import logger from '../../logger.js';

export default async function checkBattleStatus(players) {
  const inBattleRequests = players.map((player) => db.PLAYER_IN_BATTLE(player));

  logger.log('info', `Battle statuses requested for ${players.join(', ')}`);
  const result = await Promise.all(inBattleRequests);

  return result.includes(true);
}
