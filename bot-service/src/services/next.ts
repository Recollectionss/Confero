import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { votesResults } from '../utils/votesResults';
import { stateForNextCommand } from '../utils/states';
import { today } from './today';
import { CommandWithoutArgs } from '../commands/commands';

export const next: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  if (stateForNextCommand.currentIndex > stateForNextCommand.agenda.length) {
    pollChannel.send('Питання порядку денного вичерпані');
  } else if (stateForNextCommand.currentIndex == 1) {
    today(pollChannel);
  } else {
    const pollMessage = await pollChannel.send({
      content: `${PUT_TO_A_VOTE} \n ${stateForNextCommand.agenda[stateForNextCommand.currentIndex]}`,
      components: [row],
    });

    votesResults(pollChannel, pollMessage);
  }

  stateForNextCommand.currentIndex++;
};
