import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { APPROVAL_OF_THE_AGENDA, buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { votesResults } from '../utils/votesResults';
import { stateForTodayCommand } from '../utils/states';
import { Command } from '../commands/commands';

export const today: Command = async (message: Message<boolean>, args: string[], pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} ${APPROVAL_OF_THE_AGENDA}:\n ${stateForTodayCommand.agenda.join('\n')}`,
    components: [row],
  });

  votesResults(pollChannel, pollMessage);
};
