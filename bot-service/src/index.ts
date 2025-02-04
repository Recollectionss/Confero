import { Client, Events, GatewayIntentBits, Message, Partials, TextChannel } from 'discord.js';
import { connectDB } from './db/db_connect';
import { ENV_CONSTANTS } from './constants/env_constants';
import CommandHandler from './utils/command_handler/command_handler';
import dotenv from 'dotenv';
import { HELP_COMMAND_TEXT } from './constants/constants';
dotenv.config();

let pollChannel: TextChannel;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

async function startApp() {
  await connectDB();
  await client.login(ENV_CONSTANTS.discord.token);

  client.once(Events.ClientReady, async () => {
    if (client.user) {
      console.log(`Logged in as ${client.user.tag}`);
    } else {
      console.error('Client user is not initialized');
    }

    try {
      pollChannel = (await client.channels.fetch(ENV_CONSTANTS.discord.pollChannel)) as TextChannel;
      const commandChannel = (await client.channels.fetch(ENV_CONSTANTS.discord.commandChannel)) as TextChannel;
      await commandChannel.send(HELP_COMMAND_TEXT);
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
