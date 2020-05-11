import db from '../db/index.js';
import logger from '../logger.js';

function ordinal_suffix_of(i) {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) {
    return `${i}st`;
  }
  if (j == 2 && k != 12) {
    return `${i}nd`;
  }
  if (j == 3 && k != 13) {
    return `${i}rd`;
  }
  return `${i}th`;
}

export default async function rating(message) {
  let player;

  const mentions = message.mentions.users.array();
  if (mentions.length > 0) {
    player = mentions[0].id;
  } else {
    player = message.author.id;
  }

  logger.log('info', `Rating requested for player ${player}`);

  const result = await db.GET_PLAYER(player);
  message.channel.send(
    `<@${player}>'s current rating is ${
      result.rating
    }. They are ranked ${ordinal_suffix_of(
      result.ranking,
    )} on the leaderboard.`,
  );
}
