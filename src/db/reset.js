import mongodb from 'mongodb';

import { DB_URL, DB_NAME } from './constants.js';
import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function reset() {
  let _client;

  try {
    _client = await MongoClient.connect(DB_URL);
    const db = _client.db(DB_NAME);

    const playersCollection = db.collection('players');

    playersCollection.updateMany({}, { $set: { rating: 1600 } });
  } catch (err) {
    logger.log('error', err.message);
  } finally {
    _client.close();
  }
}

reset();
