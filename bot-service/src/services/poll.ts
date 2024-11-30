import { ActionRowBuilder, Message, TextChannel } from 'discord.js';
import { buttons } from '../constansts/constans';
import { votesResults } from 'utils/votesResults';

export const poll = async (
  message: Message,
  args: string[],
  pollChannel: TextChannel,
) => {
  const question = args.join(':').trim();
  const row = new ActionRowBuilder().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `**Поставлено на голосування** \n ${question}`,
    components: [row],
  });

  votesResults(pollChannel, pollMessage);
};
