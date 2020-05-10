import mongodb from 'mongodb';

import { DB_URL, DB_NAME } from './constants.js';
import logger from '../logger.js';
import Elo from '../../lib/elo.js';

const { MongoClient } = mongodb;

export default async function updatePlayerRating(player, opponent, result) {
  let client;

  try {
    client = await MongoClient.connect(DB_URL);
    const db = client.db(DB_NAME);

    const playersCollection = db.collection('players');

    const delta = Elo.getRatingDelta(player.rating, opponent.rating, result);
    const newRating = player.rating + delta;

    logger.log(
      'info',
      `${player.discordID} rating updated from ${player.rating} to ${newRating}`,
    );

    await playersCollection.updateOne(
      { discordID: player.discordID },
      {
        $set: {
          rating: newRating,
          latestDelta: delta,
        },
      },
    );

    return { ...player, rating: newRating, latestDelta: delta };
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
