import mongodb from 'mongodb';

import { DB_URL, DB_NAME } from './constants.js';
import logger from '../logger.js';
import getPlayer from './getPlayer.js';
import updatePlayerRating from './updatePlayerRating.js';

const { MongoClient } = mongodb;

export default async function concludeMatch([playerOne, playerTwo], result) {
  let client;

  try {
    client = await MongoClient.connect(DB_URL);
    const db = client.db(DB_NAME);

    const matchesCollection = db.collection('matches');
    logger.log('info', 'Saving match result');
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
