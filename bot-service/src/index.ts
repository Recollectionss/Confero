import { Client, Events, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import * as process from 'node:process';
import CommandHandler from './utils/CommandHandler';

dotenv.config();

let pollChannel: TextChannel;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

async function startApp() {
  await client.login(process.env.DISCORD_TOKEN);

  client.once(Events.ClientReady, async () => {
    if (client.user) {
      console.log(`Logged in as ${client.user.tag}`);
    } else {
      console.error('Client user is not initialized');
    }

    try {
      pollChannel = (await client.channels.fetch(process.env.POLL_CHANNEL as string)) as TextChannel;
      console.log('Poll channel initialized:', pollChannel?.id);
    } catch (error) {
      console.error('Failed to fetch pollChannel:', error);
    }

    if (pollChannel) {
      console.log('Poll channel found');
    } else {
      console.error('Poll channel is not found');
    }
  });
}

startApp();

client.on(Events.MessageCreate, async (message: Message) => {
  await CommandHandler.handle(message, pollChannel);
});
