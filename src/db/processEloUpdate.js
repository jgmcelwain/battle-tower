import mongodb from 'mongodb';

import logger from '../logger.js';
import Elo from '../../lib/elo.js';

const { MongoClient } = mongodb;

export default async function processEloUpdate(player, opponent, result) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const playersCollection = db.collection('players');

    const delta = Elo.getRatingDelta(player.rating, opponent.rating, result);
    const newRating = player.rating + delta;

    await playersCollection.updateOne(
      { discordID: player.discordID },
      {
        $set: {
          rating: newRating,
          latestDelta: delta,
        },
      },
    );

    logger.log(
      'info',
      `Rating updated for player ${player.discordID} from ${player.rating} to ${newRating}`,
    );

    return { ...player, rating: newRating, latestDelta: delta };
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
