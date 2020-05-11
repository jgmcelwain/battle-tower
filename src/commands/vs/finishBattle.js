import db from '../../db/index.js';
import logger from '../../logger.js';

export default async function finishBattle(players, result, initialMessage) {
  const match = await db.GET_ACTIVE_MATCH(players);

  if (result === 'CANCEL_BATTLE' || result === 'TIME_OUT') {
    logger.log(
      'info',
      `Match ${
        result === 'CANCEL_BATTLE' ? 'cancelled' : 'timed out'
      } with ID ${match._id}`,
    );

    await db.CONCLUDE_MATCH(match, result);

    const cancelMessage = await initialMessage.channel.send(
      `<@${players[0]}> <@${players[1]}>, your battle ${
        result === 'CANCEL_BATTLE' ? 'was cancelled' : 'timed out'
      }. Ratings have not been affected.`,
    );

    setTimeout(() => cancelMessage.delete(), 2500);
  } else {
    logger.log(
      'info',
      `Result declared for match ${match._id}, ${
        players[result === 'PLAYER_ONE' ? 0 : 1]
      } has won`,
    );

    const calculatingMessage = await initialMessage.channel.send(
      'Calculating Result...',
    );
    const [playerOne, playerTwo] = await db.CONCLUDE_MATCH(match, result);

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
