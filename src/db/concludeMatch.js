import mongodb from 'mongodb';

import logger from '../logger.js';
import getPlayer from './getPlayer.js';
import updatePlayerRating from './updatePlayerRating.js';

const { MongoClient } = mongodb;

export default async function concludeMatch([playerOne, playerTwo], result) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const matchesCollection = db.collection('matches');

    const match = matchesCollection.findOne({
      players: { playerOne, playerTwo },
    });
    logger.log('info', `Saving result for match ${match._id}`);

    await matchesCollection.updateOne(
      { players: { playerOne, playerTwo } },
      { $set: { completed_at: Date.now(), result } },
    );

    if (result === 'CANCEL_BATTLE') {
      return null;
    }

    const currentPlayerOne = await getPlayer(playerOne);
    const currentPlayerTwo = await getPlayer(playerTwo);

    const updatedPlayerOne = await updatePlayerRating(
      currentPlayerOne,
      currentPlayerTwo,
      result === 'PLAYER_ONE' ? 1 : 0,
    );
    const updatedPlayerTwo = await updatePlayerRating(
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
