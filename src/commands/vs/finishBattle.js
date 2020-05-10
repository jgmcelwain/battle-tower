import db from '../../db/index.js';
import logger from '../../logger.js';

export default async function finishBattle(players, result, initialMessage) {
  if (result === 'CANCEL_BATTLE' || result === 'TIME_OUT') {
    logger.log(
      'info',
      `Match between ${players.join(' and ')} ${
        result === 'CANCEL_BATTLE' ? 'was cancelled' : 'timed out'
      }`,
    );

    await db.CONCLUDE_MATCH(players, result);

    const cancelMessage = await initialMessage.channel.send(
      `<@${players[0]}> <@${players[1]}>, your battle ${
        result === 'CANCEL_BATTLE' ? 'was cancelled' : 'timed out'
      }`,
    );

    setTimeout(() => cancelMessage.delete(), 2500);
  } else {
    logger.log(
      'info',
      result === 'PLAYER_ONE'
        ? `Result declared: ${players[0]} has beaten ${players[1]}`
        : `Result declared: ${players[1]} has beaten ${players[0]}`,
    );

    const calculatingMessage = await initialMessage.channel.send(
      'Calculating Result...',
    );
    const [playerOne, playerTwo] = await db.CONCLUDE_MATCH(players, result);

    await calculatingMessage.delete();

    const winner = result === 'PLAYER_ONE' ? playerOne : playerTwo;

    initialMessage.channel.send(
      `🏆 <@${winner.discordID}> has won! 🏆\n\n<@${playerOne.discordID}> - ${
        playerOne.rating
      } (${playerOne.latestDelta > -1 ? '+' : ''}${playerOne.latestDelta})\n<@${
        playerTwo.discordID
      }> - ${playerTwo.rating} (${playerTwo.latestDelta > -1 ? '+' : ''}${
        playerTwo.latestDelta
      })`,
    );
  }
}
