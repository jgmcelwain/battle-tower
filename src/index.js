import dotenv from 'dotenv';
import Discord from 'discord.js';
import logger from './logger.js';
import { vs, rating } from './commands/index.js';

dotenv.config();

const discordClient = new Discord.Client();

async function main() {
  discordClient.on('ready', () => {
    logger.log(
      'info',
      `Logged in as ${discordClient.user.tag} - waiting for messages`,
    );

    discordClient.user.setActivity('Version 0.0.1', { type: 'PLAYING' });
  });

  discordClient.on('message', async (message) => {
    if (
      message.channel.name === 'battle-tower' &&
      message.content.startsWith('!')
    ) {
      const [command] = message.content.split(' ');

      logger.log('info', `${command} identified`);

      switch (command) {
        case '!vs':
          vs(message, discordClient);
          break;
        case '!rating':
          rating(message, discordClient);
          break;
        default:
          logger.log(
            'warn',
            `${command} is not a recognised Battle Tower command`,
          );
          break;
      }
    }
  });

  discordClient.login(process.env.DISCORD_CLIENT_TOKEN);
}

main();
