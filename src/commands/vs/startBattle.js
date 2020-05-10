import { EMOJIS } from './constants.js';
import finishBattle from './finishBattle.js';
import logger from '../../logger.js';
import db from '../../db/index.js';

export default async function startBattle(
  [playerOne, playerTwo],
  initialMessage,
) {
  logger.log('info', `Creating match between ${playerOne} and ${playerTwo}`);

  await db.CREATE_MATCH(playerOne, playerTwo);

  const battleMessage = await initialMessage.channel.send(
    `Battle Started!

Once you have completed your battle, both players must react to this message to report the result.

${EMOJIS.PLAYER_ONE} - <@${playerOne}> Wins
${EMOJIS.PLAYER_TWO} - <@${playerTwo}> Wins
${EMOJIS.CANCEL_BATTLE} - Cancel Battle`,
  );

  await battleMessage.react(EMOJIS.PLAYER_ONE);
  await battleMessage.react(EMOJIS.PLAYER_TWO);
  await battleMessage.react(EMOJIS.CANCEL_BATTLE);

  const resultCollector = battleMessage.createReactionCollector(
    (reaction, user) =>
      [playerOne, playerTwo].includes(user.id) &&
      [EMOJIS.PLAYER_ONE, EMOJIS.PLAYER_TWO, EMOJIS.CANCEL_BATTLE].includes(
        reaction.emoji.name,
      ),
    { time: 1000 * 60 * 30 },
  );

  resultCollector.on('collect', async () => {
    const chosen = battleMessage.reactions.cache.find(
      (react) => react.count === 3,
    );

    if (chosen !== undefined) {
      battleMessage.delete();

      let result;

      switch (chosen._emoji.name) {
        case EMOJIS.PLAYER_ONE: {
          result = 'PLAYER_ONE';
          break;
        }
        case EMOJIS.PLAYER_TWO: {
          result = 'PLAYER_TWO';
          break;
        }
        default: {
          result = 'CANCEL_BATTLE';
        }
      }

      finishBattle([playerOne, playerTwo], result, initialMessage);
    }
  });
  resultCollector.on('end', () => {
    if (!battleMessage.deleted) {
      battleMessage.delete();

      finishBattle([playerOne, playerTwo], 'TIME_OUT', initialMessage);
    }
  });
}
