import mongodb from 'mongodb';

import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function getActiveMatch([playerOne, playerTwo]) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const matchesCollection = db.collection('matches');

    const match = await matchesCollection.findOne({
      players: { playerOne, playerTwo },
      result: null,
    });

    return match;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
