import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, OPEN_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
import { votesResults } from '../utils/votesResults';
import { Command } from '../commands/commands';

export const open: Command = async (message: Message, args: string[], pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${OPEN_OF_THE_MEETING}`,
    components: [row],
  });

  votesResults(pollChannel, pollMessage);
};
