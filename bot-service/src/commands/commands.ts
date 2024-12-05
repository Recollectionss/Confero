import { Message, TextChannel } from 'discord.js';
import { poll } from '../services/poll';
import { set } from '../services/set';
import { today } from '../services/today';
import { today_info } from '../services/today_info';
import { next } from '../services/next';
import { open } from '../services/open';
import { close } from '../services/close';
import { help } from '../services/help';
import { registry_open } from '../services/registry_open';

export type CommandWithArgs = (message: Message, args: string[], poolChannel: TextChannel) => Promise<void>;

export type CommandWithoutArgs = (channel: TextChannel) => Promise<void>;

type CommandsList = {
  withArgs: Record<string, CommandWithArgs>;
  withoutArgs: Record<string, CommandWithoutArgs>;
};

export const commands: CommandsList = {
  withArgs: {
    poll: poll,
    set: set,
  },
  withoutArgs: {
    help: help,
    open: open,
    close: close,
    today: today,
    today_info: today_info,
    next: next,
    registry_open: registry_open,
  },
};
