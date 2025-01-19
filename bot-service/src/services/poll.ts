import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { CommandWithArgs } from '../commands/commands';
import { votesResults } from '../utils/votes_results';
import { Poll } from '../db/models/poll';
import { Meeting } from '../db/models/meeting';
import { Voted } from '../db/models/voted';
import { sequelize } from '../db/db_connect';

export const poll: CommandWithArgs = async (message: Message, args: string[], pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${args[0]}`,
    components: [row],
  });

  await sequelize.transaction(async (transaction) => {
    const meeting = await Meeting.findOne({
      where: { isActive: true },
      transaction,
    });
    const pollStart = await Poll.create({ question: args[0], meetingId: meeting?.meetingId }, { transaction });

    const voted = await Voted.create({ votedFor: args[0], pollId: pollStart.pollId }, { transaction });
    await votesResults(pollMessage, voted);
  });
};
