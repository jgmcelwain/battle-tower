import db from '../db/index.js';
import logger from '../logger.js';

export default async function rating(message) {
  let player;

  const mentions = message.mentions.users.array();
  if (mentions.length > 0) {
    player = mentions[0].id;
  } else {
    player = message.author.id;
  }

  logger.log('info', `Rating for player ${player} requested`);

  const result = await db.GET_PLAYER(player);

  message.channel.send(`<@${player}>'s current rating is ${result.rating}`);
}
