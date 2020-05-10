import mongodb from 'mongodb';

import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function createMatch(playerOne, playerTwo) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const matchesCollection = db.collection('matches');

    const record = await matchesCollection.insertOne({
      players: { playerOne, playerTwo },
      result: null,
      started_at: Date.now(),
      completed_at: null,
    });

    const match = record.ops[0];

    logger.log(
      'info',
      `Match ${match._id} created between ${playerOne} and ${playerTwo}`,
    );

    return match;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
