import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, CLOSE_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
import { votesResults } from '../utils/votesResults';
import { Command } from '../commands/commands';

export const close: Command = async (message: Message, args: string[], pollChannel: TextChannel) => {
  const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${CLOSE_OF_THE_MEETING}`,
    components: [row],
  });

  votesResults(pollChannel, pollMessage);
};
