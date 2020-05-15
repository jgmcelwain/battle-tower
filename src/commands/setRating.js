import db from '../db/index.js';
import logger from '../logger.js';

export default async function setRating(message) {
  const isAdmin = message.member.hasPermission('ADMINISTRATOR');
  if (isAdmin === false) {
    message.reply('you do not have the required permissions for this command.');

    return;
  }

  let player;

  const mentions = message.mentions.users.array();
  if (mentions.length > 0) {
    player = mentions[0].id;
  } else {
    player = message.author.id;
  }

  await db.GET_PLAYER(player);

  const result = new RegExp(/\s[0-9]{3,}/).exec(message.content);
  if (!result) {
    message.reply(`please provide a target rating.`);
    logger.log(
      'info',
      `Rating adjustment requested for player ${player} but no target rating supplied`,
    );

    return;
  }

  const targetRating = parseInt(result[0], 10);
  logger.log(
    'info',
    `Rating adjustment requested for player ${player} to ${targetRating}`,
  );

  await db.SET_PLAYER_RATING(player, targetRating);

  message.channel.send(
    `Rating for <@${player}> has been set to ${targetRating}`,
  );
}
