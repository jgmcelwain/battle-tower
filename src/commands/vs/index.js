import createChallenge from './createChallenge.js';
import checkBattleStatus from './checkBattleStatus.js';

export default async function vs(message) {
  const playerOne = message.author.id;
  const opponent = message.mentions.users.array()[0];

  if (opponent === undefined) {
    message.reply('your battle could not be started - no opponent found.');
  }

  const playerTwo = opponent.id;
  if (playerTwo === message.client.user.id) {
    await message.reply('you cannot challenge me to a battle!');

    return;
  }

  if (playerOne === playerTwo) {
    await message.reply('you cannot challenge yourself to a battle!');

    return;
  }

  const playerInBattle = await checkBattleStatus([playerOne, playerTwo]);
  if (playerInBattle) {
    await message.reply(
      'at least one of these players are in an active battle!',
    );

    return;
  }

  createChallenge([playerOne, playerTwo], message);
}
