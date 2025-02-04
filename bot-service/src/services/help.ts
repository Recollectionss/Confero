import { TextChannel } from 'discord.js';
import { CommandWithoutArgs } from '../commands/commands';
import { HELP_COMMAND_TEXT } from '../constants/constants';

export const help: CommandWithoutArgs = async (commandChannel: TextChannel) => {
  await commandChannel.send(HELP_COMMAND_TEXT);
};
