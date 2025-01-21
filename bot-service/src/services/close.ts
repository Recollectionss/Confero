import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons, CLOSE_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
import { CommandWithoutArgs } from '../commands/commands';
import { sequelize } from '../db/db_connect';
import { Meeting } from '../db/models/meeting';
import { Poll } from '../db/models/poll';
import { Voted } from '../db/models/voted';
import { votesResults } from '../utils/votes_results';
import { getAllResultsFromMeeting } from '../utils/get_all_results_from_meeting';

export const close: CommandWithoutArgs = async (channel: TextChannel) => {
  const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

  const pollMessage = await channel.send({
    content: `${PUT_TO_A_VOTE} \n ${CLOSE_OF_THE_MEETING}`,
    components: [row],
  });

  const [meeting, voted] = await sequelize.transaction(async (transaction) => {
    const meeting = (await Meeting.findOne({
      where: { isActive: true },
      transaction,
    })) as Meeting;

    const pollStart = await Poll.create(
      { question: CLOSE_OF_THE_MEETING, meetingId: meeting?.meetingId },
      { transaction },
    );

    const voted = await Voted.create({ votedFor: CLOSE_OF_THE_MEETING, pollId: pollStart.pollId }, { transaction });
    return [meeting, voted];
  });

  await votesResults(pollMessage, voted);
  await getAllResultsFromMeeting(channel, meeting);
};
