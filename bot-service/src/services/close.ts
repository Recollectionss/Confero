import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons, CLOSE_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
import { votesResults } from '../utils/votesResults';
import { CommandWithoutArgs } from '../commands/commands';

export const close: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${CLOSE_OF_THE_MEETING}`,
    components: [row],
  });

  await votesResults(pollChannel, pollMessage);
};
