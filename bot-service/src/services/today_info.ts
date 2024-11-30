import { AGENDA } from '../constants/constants';
import { stateForTodayCommand } from '../utils/states';
import { Message, TextChannel } from 'discord.js';
import { Command } from '../commands/commands';

export const today_info: Command = async (message: Message, args: string[], pollChannel: TextChannel) => {
  if (stateForTodayCommand.agenda.length > 0) {
    await pollChannel.send({
      content: `** ${AGENDA}** \n${stateForTodayCommand.agenda.join('\n')}`,
    });
  } else {
    await pollChannel.send({
      content: `** ${AGENDA}** \n Відсутній `,
    });
  }
};
