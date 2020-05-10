import mongodb from 'mongodb';

import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function getPlayer(discordID) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const playersCollection = db.collection('players');

    const playerRecord = await playersCollection.findOne({ discordID });

    if (!playerRecord) {
      const record = await playersCollection.insertOne({
        discordID,
        rating: 1600,
        latestDelta: 0,
      });

      return record.ops[0];
    }

    return playerRecord;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
