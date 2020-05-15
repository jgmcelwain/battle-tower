import mongodb from 'mongodb';

import logger from '../logger.js';
import getPlayer from './getPlayer.js';
import processEloUpdate from './processEloUpdate.js';

const { MongoClient } = mongodb;

export default async function concludeMatch(match, result) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const matchesCollection = db.collection('matches');

    await matchesCollection.updateOne(
      { _id: match._id },
      { $set: { completed_at: Date.now(), result } },
    );
    logger.log('info', `Result saved for match ${match._id}`);

    if (result === 'CANCEL_BATTLE') {
      return null;
    }

    const { playerOne, playerTwo } = match.players;

    const currentPlayerOne = await getPlayer(playerOne);
    const currentPlayerTwo = await getPlayer(playerTwo);

    const updatedPlayerOne = await processEloUpdate(
      currentPlayerOne,
      currentPlayerTwo,
      result === 'PLAYER_ONE' ? 1 : 0,
    );
    const updatedPlayerTwo = await processEloUpdate(
      currentPlayerTwo,
      currentPlayerOne,
      result === 'PLAYER_TWO' ? 1 : 0,
    );

    return [updatedPlayerOne, updatedPlayerTwo];
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
