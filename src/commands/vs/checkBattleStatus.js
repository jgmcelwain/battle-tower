import db from '../../db/index.js';
import logger from '../../logger.js';

export default async function checkBattleStatus(players) {
  const inBattleRequests = players.map(async (player) => {
    const currentBattle = await db.GET_CURRENT_BATTLE(player);

    return currentBattle !== null;
  });

  logger.log('info', `Battle statuses requested for ${players.join(', ')}`);
  const result = await Promise.all(inBattleRequests);

  return result.includes(true);
}
