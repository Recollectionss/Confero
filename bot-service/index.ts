import { Client, GatewayIntentBits, Events, Message, TextChannel } from 'discord.js';
import { commands } from './src/commands/commands';
import { configDotenv } from 'dotenv';
import * as process from 'node:process';
configDotenv();

const commandChannelId = process.env.COMMAND_CHANNEL;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const pollChannel = client.channels.cache.get(process.env.POLL_CHANNEL as string) as TextChannel;

client.once(Events.ClientReady, () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  } else {
    console.error('Client user is not initialized');
  }

  if (pollChannel) {
    pollChannel.send('Канал для опитування не знайдено');
  }
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot || message.channel.id !== commandChannelId) return;

  const [command, ...args] = message.content.slice(1).split(':');
  if (commands[command]) {
    commands[command](message, args, pollChannel);
  }
});

client.login(process.env.DISCORD_TOKEN);
