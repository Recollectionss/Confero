import { Message, TextChannel } from 'discord.js';
import { commands } from '../../commands/commands';
import { ENV_CONSTANTS } from '../../constants/env_constants';
import { Middleware } from '../middleware/middleware';

class CommandHandler {
  async handle(message: Message, pollChannel: TextChannel) {
    if (message.author.bot || message.channel.id !== ENV_CONSTANTS.discord.commandChannel) return;
    await this.executeCommand(message, pollChannel);
  }

  async executeCommand(message: Message, pollChannel: TextChannel) {
    const [command, ...argsParts] = await this.parseCommand(message);
    if (!commands.withoutArgs[command] && !commands.withArgs[command]) {
      await (message.channel as TextChannel).send(`Unknown command: ${command}`);
      return;
    }
    try {
      await new Middleware(command).use();

      if (commands.withoutArgs[command]) {
        await commands.withoutArgs[command](command === 'help' ? (message.channel as TextChannel) : pollChannel);
      } else {
        const args = await this.parseArgs(command, argsParts);
        await commands.withArgs[command](message, args, pollChannel);
      }
    } catch (e) {
      console.error(`Error executing command "${command}":`, e);
      await (message.channel as TextChannel).send(`${e}`);
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
      trueArgs = argsJoined.split('/');
    } else {
      trueArgs = [argsJoined];
    }

    return trueArgs;
  }
}

export default new CommandHandler();
