import { Message, TextChannel } from 'discord.js';
import { commands } from '../commands/commands';
import process from 'node:process';
import dotenv from 'dotenv';
dotenv.config();
const commandChannelId = process.env.COMMAND_CHANNEL as string;

class CommandHandler {
  handle(message: Message, pollChannel: TextChannel) {
    if (message.author.bot || message.channel.id !== commandChannelId) return;
    this.executeCommand(message, pollChannel);
  }
  executeCommand(message: Message, pollChannel: TextChannel) {
    const [command, ...argsParts] = this.parseCommand(message);
    if (!commands.withoutArgs[command] && !commands.withArgs[command]) {
      (message.channel as TextChannel).send(`Unknown command: ${command}`);
      return;
    }
    if (commands.withoutArgs[command]) {
      commands.withoutArgs[command](command === 'help' ? (message.channel as TextChannel) : pollChannel);
    } else {
      try {
        const args = this.parseArgs(command, argsParts);
        commands.withArgs[command](message, args, pollChannel);
      } catch (e) {
        console.error(`Error executing command "${command}":`, e);
        (message.channel as TextChannel).send(`${e}`);
      }
    }
  }
  parseCommand(message: Message) {
    return message.content.slice(1).split(':');
  }
  parseArgs(command: string, args: string[]) {
    const argsJoined = args.join('');
    let trueArgs: string[];

    if (!argsJoined) throw new Error('Invalid args');

    if (argsJoined.includes('/')) {
      if (command !== 'set') {
        throw new Error('Invalid args');
      }
      trueArgs = argsJoined.split('/');
    } else {
      trueArgs = [argsJoined];
    }

    return trueArgs;
  }
}

export default new CommandHandler();
