import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons, OPEN_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
import { CommandWithoutArgs } from '../commands/commands';
import { Poll } from '../db/models/poll';
import { sequelize } from '../db/db_connect';
import { Meeting } from '../db/models/meeting';
import { Voted } from '../db/models/voted';
import { votesResults } from '../utils/results/votes_results';

export const open: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${OPEN_OF_THE_MEETING}`,
    components: [row],
  });

  const voted = await sequelize.transaction(async (transaction) => {
    const meeting = await Meeting.findOne({ where: { isActive: true }, attributes: ['meetingId'], transaction });
    const existingOpenPoll = await Poll.findOne({
      where: { question: OPEN_OF_THE_MEETING, meetingId: meeting?.meetingId },
      transaction,
    });
    if (!existingOpenPoll) {
      const poll = await Poll.create({ question: OPEN_OF_THE_MEETING, meetingId: meeting?.meetingId }, { transaction });
      return await Voted.create({ votedFor: OPEN_OF_THE_MEETING, pollId: poll?.pollId }, { transaction });
    } else {
      return (await Voted.findOne({
        where: { votedFor: OPEN_OF_THE_MEETING, pollId: existingOpenPoll?.pollId },
        transaction,
      })) as Voted;
    }
  });
  await votesResults(pollMessage, voted);
};
