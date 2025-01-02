import { Message, TextChannel } from 'discord.js';
import { commands } from '../commands/commands';
import process from 'node:process';
import dotenv from 'dotenv';
dotenv.config();
const commandChannelId = process.env.COMMAND_CHANNEL as string;

class CommandHandler {
  async handle(message: Message, pollChannel: TextChannel) {
    if (message.author.bot || message.channel.id !== commandChannelId) return;
    await this.executeCommand(message, pollChannel);
  }

  async executeCommand(message: Message, pollChannel: TextChannel) {
    const [command, ...argsParts] = await this.parseCommand(message);
    if (!commands.withoutArgs[command] && !commands.withArgs[command]) {
      await (message.channel as TextChannel).send(`Unknown command: ${command}`);
      return;
    }
    if (commands.withoutArgs[command]) {
      await commands.withoutArgs[command](command === 'help' ? (message.channel as TextChannel) : pollChannel);
    } else {
      try {
        const args = await this.parseArgs(command, argsParts);
        await commands.withArgs[command](message, args, pollChannel);
      } catch (e) {
        console.error(`Error executing command "${command}":`, e);
        await (message.channel as TextChannel).send(`${e}`);
      }
    }
  }

  async parseCommand(message: Message) {
    return message.content.slice(1).split(':');
  }

  async parseArgs(command: string, args: string[]) {
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
