import mongodb from 'mongodb';

import logger from '../logger.js';

import getPlayer from './getPlayer.js';

const { MongoClient } = mongodb;

export default async function setPlayerRating(discordID, rating) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const playersCollection = db.collection('players');

    const player = await getPlayer(discordID);

    await playersCollection.updateOne(
      { discordID },
      {
        $set: {
          rating,
          latestDelta: null,
        },
      },
    );

    logger.log('info', `Rating set for player ${discordID} to ${rating}`);

    return { ...player, rating, latestDelta: null };
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
