import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons, OPEN_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
import { CommandWithoutArgs } from '../commands/commands';
import { Poll } from '../db/models/poll';
import { sequelize } from '../db/db_connect';
import { Meeting } from '../db/models/meeting';
import { Voted } from '../db/models/voted';
import { votesResults } from '../utils/votes_results';
import { RegistrationOnMeeting } from '../db/models';

export const open: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  const pollMessage = await pollChannel.send({
    content: `${PUT_TO_A_VOTE} \n ${OPEN_OF_THE_MEETING}`,
    components: [row],
  });

  const voted = await sequelize.transaction(async (transaction) => {
    const meeting = await Meeting.findOne({ where: { isActive: true }, attributes: ['meetingId'], transaction });
    const registeredUserCount = await RegistrationOnMeeting.count({
      where: {
        meetingId: meeting?.meetingId,
        userVerified: true,
      },
    });

    if (registeredUserCount < 6) {
      throw new Error('Недостатня кількість зареєстрованих делегатів для відкриття засідання');
    }

    const poll = await Poll.create({ question: OPEN_OF_THE_MEETING, meetingId: meeting?.meetingId }, { transaction });
    return await Voted.create({ votedFor: OPEN_OF_THE_MEETING, pollId: poll?.pollId }, { transaction });
  });
  await votesResults(pollMessage, voted);
};
