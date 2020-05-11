import mongodb from 'mongodb';

import logger from '../logger.js';

const { MongoClient } = mongodb;

export default async function getPlayer(discordID) {
  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB_NAME);

    const playersCollection = db.collection('players');

    let player = await playersCollection.findOne({ discordID });

    if (!player) {
      const record = await playersCollection.insertOne({
        discordID,
        rating: 1600,
        latestDelta: 0,
      });

      [player] = record.ops;
    }

    const playersCursor = playersCollection.find().sort({ rating: -1 });
    const allPlayers = await playersCursor.toArray();
    player.ranking = allPlayers.findIndex((p) => p.discordID === discordID) + 1;

    return player;
  } catch (err) {
    logger.log('error', err.message);

    return err;
  } finally {
    client.close();
  }
}
