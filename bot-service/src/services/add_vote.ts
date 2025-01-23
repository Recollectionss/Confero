import { CommandWithArgs } from '../commands/commands';
import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { sequelize } from '../db/db_connect';
import { Poll } from '../db/models/poll';
import { Voted } from '../db/models/voted';
import { votesResults } from '../utils/results/votes_results';

export const addVote: CommandWithArgs = async (message: Message, args: string[], pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const [poll, voted] = await sequelize.transaction(async (transaction) => {
    const poll = await Poll.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['pollId', 'question'],
      transaction,
    });
    const voted = await Voted.create({ votedFor: args[0], pollId: poll?.pollId }, { transaction });
    return [poll, voted];
  });

  const pollMessage = await pollChannel.send({
    content: `${poll?.question}  ${PUT_TO_A_VOTE} \n ${args[0]}`,
    components: [row],
  });

  await votesResults(pollMessage, voted);
};
