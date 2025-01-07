import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { APPROVAL_OF_THE_AGENDA, buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { stateForTodayCommand } from '../utils/states';
import { CommandWithoutArgs } from '../commands/commands';
import { votesResults } from '../utils/votes_results';

export const today: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} ${APPROVAL_OF_THE_AGENDA}:\n ${stateForTodayCommand.agenda.join('\n')}`,
    components: [row],
  });

  await votesResults(pollMessage);
};
