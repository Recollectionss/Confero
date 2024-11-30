import { Message, TextChannel } from 'discord.js';
import { commands } from '../commands/commands';
import process from 'node:process';
import dotenv from 'dotenv';
dotenv.config();
const commandChannelId = process.env.COMMAND_CHANNEL as string;

class CommandHandler {
  handle(message: Message, pollChannel: TextChannel) {
    if (message.author.bot || message.channel.id !== commandChannelId) return;

    const { command, args } = this.parse(message);
    console.log(this.parse(message));
    if (commands[command]) {
      console.log(commands[command]);
      commands[command](message, args, pollChannel);
    }
  }
  parse(message: Message): { command: string; args: string[] } {
    const [command, ...argsParts] = message.content.slice(1).split(':');
    let args: string[];
    const argsJoined = argsParts.join(':');
    if (argsJoined.length < 1) {
      return { command, args: [] };
    } else {
      if (argsJoined.includes('/')) {
        if (command !== 'set') {
          (message.channel as TextChannel).send(`Неправильна команда, виконається просто ${command}`);
          return { command, args: [] };
        }
        args = argsJoined.split('/');
      } else {
        args = [argsJoined];
      }
    }
    return { command, args };
  }
}

export default new CommandHandler();
