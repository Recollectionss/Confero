import { Message, TextChannel } from 'discord.js';
import { poll } from '../services/poll';
import { set } from '../services/set';
import { today } from '../services/today';
import { today_info } from '../services/today_info';
import { next } from '../services/next';
import { open } from '../services/open';
import { close } from '../services/close';

export type Command = (message: Message, args: string[], poolChannel: TextChannel) => Promise<void>;

export const commands: Record<string, Command> = {
  pool: poll,
  open: open,
  close: close,
  set: set,
  today: today,
  today_info: today_info,
  next: next,
};
