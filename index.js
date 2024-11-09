import { Client, GatewayIntentBits, Events, ButtonStyle, ComponentType } from 'discord.js';
import {commands} from "./commands/commands.js";
import 'dotenv/config';

const commandChannelId = process.env.COMMAND_CHANNEL;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || message.channel.id !== commandChannelId) return;

    const [command, ...args] = message.content.slice(1).split(':');
    if (commands[command]) {
        commands[command](message, args);
    }
});

client.login(process.env.DISCORD_TOKEN);


