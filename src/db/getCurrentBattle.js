import mongodb from 'mongodb';

import { DB_URL, DB_NAME } from './constants.js';
import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function getCurrentBattle(discordID) {
  let client;

  try {
    client = await MongoClient.connect(DB_URL);
    const db = client.db(DB_NAME);

    const matchesCollection = db.collection('matches');

    const currentBattle = await matchesCollection.findOne({
      result: null,
      $or: [
        { 'players.playerOne': discordID },
        { 'players.playerTwo': discordID },
      ],
    });

    return currentBattle;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
