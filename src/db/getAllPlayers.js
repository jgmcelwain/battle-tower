import mongodb from 'mongodb';

import { DB_URL, DB_NAME } from './constants.js';
import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function getAllPlayers() {
  let client;

  try {
    client = await MongoClient.connect(DB_URL);
    const db = client.db(DB_NAME);

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
