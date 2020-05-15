import db from '../db/index.js';
import logger from '../logger.js';

export default async function customMatch(message) {
  const isAdmin = message.member.hasPermission('ADMINISTRATOR');
  if (isAdmin === false) {
    message.reply('you do not have the required permissions for this command.');

    return;
  }

  const mentions = message.mentions.users
    .array()
    .sort(
      (a, b) => message.content.indexOf(a.id) - message.content.indexOf(b.id),
    );

  const [playerOne, playerTwo] = mentions;

  if (!playerOne || !playerTwo) {
    message.reply('you must provide two users to create a custom match for.');

    return;
  }

  const result = message.content.includes(' p1')
    ? 'PLAYER_ONE'
    : message.content.includes(' p2')
    ? 'PLAYER_TWO'
    : null;
  if (result === null) {
    message.reply('you must provide a valid result - either `p1` or `p2`');

    return;
  }

  logger.log(
    'info',
    `Cutsom match requested between ${playerOne.id} and ${playerTwo.id}, ${result} is the victor.`,
  );

  const match = await db.CREATE_MATCH(playerOne.id, playerTwo.id);
  const [updatedPlayerOne, updatedPlayerTwo] = await db.CONCLUDE_MATCH(
    match,
    result,
  );

  message.channel.send(
    `Custom match saved.\n\n<@${updatedPlayerOne.discordID}> - ${
      updatedPlayerOne.rating
    } (${updatedPlayerOne.latestDelta > -1 ? '+' : ''}${
      updatedPlayerOne.latestDelta
    })\n<@${updatedPlayerTwo.discordID}> - ${updatedPlayerTwo.rating} (${
      updatedPlayerTwo.latestDelta > -1 ? '+' : ''
    }${updatedPlayerTwo.latestDelta})`,
  );
}
