import mongodb from 'mongodb';

import { DB_NAME } from './constants.js';
import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function reset() {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(DB_NAME);

    const playersCollection = db.collection('players');

    playersCollection.updateMany({}, { $set: { rating: 1600 } });
  } catch (err) {
    logger.log('error', err.message);
  } finally {
    client.close();
  }
}

reset();
