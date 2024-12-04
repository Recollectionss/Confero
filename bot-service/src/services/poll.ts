import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { CommandWithArgs } from '../commands/commands';
import { votesResults } from '../utils/votesResults';

export const poll: CommandWithArgs = async (message: Message, args: string[], pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${args[0]}`,
    components: [row],
  });

  await votesResults(pollChannel, pollMessage);
};
