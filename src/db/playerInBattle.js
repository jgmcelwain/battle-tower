import mongodb from 'mongodb';

import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function playerInBattle(discordID) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const matchesCollection = db.collection('matches');

    const currentBattle = await matchesCollection.findOne({
      result: null,
      $or: [
        { 'players.playerOne': discordID },
        { 'players.playerTwo': discordID },
      ],
    });

    return currentBattle !== null;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
