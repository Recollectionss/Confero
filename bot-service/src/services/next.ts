import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { stateForNextCommand } from '../utils/states';
import { today } from './today';
import { CommandWithoutArgs } from '../commands/commands';
import { votesResults } from '../utils/votes_results';

export const next: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  if (stateForNextCommand.currentIndex > stateForNextCommand.agenda.length) {
    await pollChannel.send('Питання порядку денного вичерпані');
  } else if (stateForNextCommand.currentIndex == 1) {
    await today(pollChannel);
  } else {
    const pollMessage = await pollChannel.send({
      content: `${PUT_TO_A_VOTE} \n ${stateForNextCommand.agenda[stateForNextCommand.currentIndex]}`,
      components: [row],
    });

    await votesResults(pollMessage);
  }

  stateForNextCommand.currentIndex++;
};
