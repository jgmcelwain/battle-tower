import mongodb from 'mongodb';

import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function getAllPlayers() {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const playersCollection = db.collection('players');

    const players = await playersCollection.find({});

    return players;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
