import { EMOJIS } from './constants.js';

import db from '../../db/index.js';
import startBattle from './startBattle.js';
import logger from '../../logger.js';

export default async function createChallenge([playerOne, playerTwo], message) {
  // get the two players from the DB. this will create records for the player(s)
  // if they do not exist
  await db.GET_PLAYER(playerOne);
  await db.GET_PLAYER(playerTwo);

  logger.log('info', `Challenge created by ${playerOne} for ${playerTwo}`);

  // create a challenge message. this message will allow the challengeed player
  // (playerTwo) to accept the battle
  const challengeMessage = await message.channel.send(
    `<@${playerTwo}>, you have been challenged to a battle by <@${playerOne}>!
  
React to this message with a ${EMOJIS.ACCEPT_BATTLE} to accept.`,
  );
  await challengeMessage.react(EMOJIS.ACCEPT_BATTLE);

  // create a reaction collector that collects accept battle reacts from the
  // challengeed player for one minute
  const challengeReactCollector = challengeMessage.createReactionCollector(
    (reaction, user) =>
      user.id === playerTwo && reaction.emoji.name === EMOJIS.ACCEPT_BATTLE,
    { time: 1000 * 60 },
  );

  challengeReactCollector.on('collect', (reaction, user) => {
    logger.log(
      'info',
      `Reaction ${reaction.emoji.name} added by ${user.id} to message ${reaction.message.id}`,
    );

    challengeMessage.delete();

    // if a react is collected then we can start the battle
    startBattle([playerOne, playerTwo], message);
  });
  challengeReactCollector.on('end', () => {
    if (!challengeMessage.deleted) {
      logger.log(
        'info',
        `Challenge created by ${playerOne} to ${playerTwo} expired`,
      );

      challengeMessage.delete();
    }
  });
}
