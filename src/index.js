import dotenv from 'dotenv';
import Discord from 'discord.js';
import logger from './logger.js';
import { vs, rating, setRating, help } from './commands/index.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const discordClient = new Discord.Client();

async function main() {
  discordClient.on('ready', () => {
    logger.log('info', `Bot logged in as ${discordClient.user.tag}`);

    discordClient.user.setActivity('Version 0.0.1', { type: 'PLAYING' });
  });

  discordClient.on('message', async (message) => {
    if (
      message.channel.name === 'battle-tower' &&
      message.content.startsWith('!')
    ) {
      const [command] = message.content.split(' ');

      logger.log(
        'info',
        `Command ${command} identified in message ${message.id} from user ${message.author.id}`,
      );

      switch (command) {
        case '!vs':
          vs(message, discordClient);
          break;
        case '!rating':
          rating(message, discordClient);
          break;
        case '!rank':
          rating(message, discordClient);
          break;
        case '!bthelp':
          help(message);
          break;
        case '!set':
          setRating(message);
          break;
        default:
          break;
      }
    }
  });

  discordClient.login(process.env.DISCORD_CLIENT_TOKEN);
}

main();
