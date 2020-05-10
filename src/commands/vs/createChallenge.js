import { EMOJIS } from './constants.js';

import db from '../../db/index.js';
import startBattle from './startBattle.js';
import logger from '../../logger.js';

export default async function createChallenge([playerOne, playerTwo], message) {
  await db.GET_PLAYER(playerOne);
  await db.GET_PLAYER(playerTwo);

  logger.log('info', `Challenge created by ${playerOne} for ${playerTwo}`);
  const challengeMessage = await message.channel.send(
    `<@${playerTwo}>, you have been challenged to a battle by <@${playerOne}>!
  
    React to this message with a ${EMOJIS.ACCEPT_BATTLE} to accept.`,
  );
  await challengeMessage.react(EMOJIS.ACCEPT_BATTLE);

  const challengeReactCollector = challengeMessage.createReactionCollector(
    (reaction, user) =>
      user.id === playerTwo && reaction.emoji.name === EMOJIS.ACCEPT_BATTLE,
    { time: 1000 * 60 },
  );

  challengeReactCollector.on('collect', () => {
    challengeMessage.delete();

    startBattle([playerOne, playerTwo], message);
  });
  challengeReactCollector.on('end', () => {
    if (!challengeMessage.deleted) {
      logger.log('info', `Challenge from ${playerOne} to ${playerTwo} expired`);

      challengeMessage.delete();
    }
  });
}
