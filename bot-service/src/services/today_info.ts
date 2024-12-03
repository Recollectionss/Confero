import { AGENDA } from '../constants/constants';
import { stateForTodayCommand } from '../utils/states';
import { TextChannel } from 'discord.js';
import { CommandWithoutArgs } from '../commands/commands';

export const today_info: CommandWithoutArgs = async (pollChannel: TextChannel) => {
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
