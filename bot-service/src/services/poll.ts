import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, OPEN_OF_THE_MEETING, PUT_TO_A_VOTE } from '../constants/constants';
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

  const voted = await sequelize.transaction(async (transaction) => {
    const meeting = await Meeting.findOne({
      where: { isActive: true },
      transaction,
    });
    const openPoll = await Poll.findOne({ where: { question: OPEN_OF_THE_MEETING }, transaction });
    const voted = await Voted.findOne({ where: { pollId: openPoll?.pollId, result: true } });
    if (!meeting || !openPoll || !voted) {
      throw new Error('Ви не можете створити голосування без відкритого засідання');
    }

    const pollStart = await Poll.create({ question: args[0], meetingId: meeting?.meetingId }, { transaction });

    return await Voted.create({ votedFor: args[1], pollId: pollStart.pollId }, { transaction });
  });

  await votesResults(pollMessage, voted);
};
