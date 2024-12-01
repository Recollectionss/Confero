import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { Command } from '../commands/commands';
import { votesResults } from '../utils/votesResults';

export const poll: Command = async (message: Message, args: string[], pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${args[0]}`,
    components: [row],
  });

  votesResults(pollChannel, pollMessage);
};
