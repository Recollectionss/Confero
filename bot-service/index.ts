import { Client, GatewayIntentBits, Events, Message, TextChannel } from 'discord.js';
import { commands } from './src/commands/commands';
import { configDotenv } from 'dotenv';
import * as process from 'node:process';
configDotenv();

const commandChannelId = process.env.COMMAND_CHANNEL;
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
      console.log('Канал для опитування знайдено');
    } else {
      console.error('Poll channel is not found');
    }
  });

  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || message.channel.id !== commandChannelId) return;

    const [command, ...args] = message.content.slice(1).split(':');
    if (commands[command]) {
      commands[command](message, args, pollChannel);
    }
  });
}

startApp();
