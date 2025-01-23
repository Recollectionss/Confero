import { Message, TextChannel } from 'discord.js';
import { poll } from '../services/poll';
import { open } from '../services/open';
import { close } from '../services/close';
import { help } from '../services/help';
import { registry_open } from '../services/registry_open';
import { addVote } from '../services/add_vote';
import { getResults } from '../services/get_results';

export type CommandWithArgs = (message: Message, args: string[], poolChannel: TextChannel) => Promise<void>;

export type CommandWithoutArgs = (channel: TextChannel) => Promise<void>;

type CommandsList = {
  withArgs: Record<string, CommandWithArgs>;
  withoutArgs: Record<string, CommandWithoutArgs>;
};

export const commands: CommandsList = {
  withArgs: {
    poll: poll,
    add_vote: addVote,
  },
  withoutArgs: {
    help: help,
    open: open,
    close: close,
    registry_open: registry_open,
    get_results: getResults,
  },
};
