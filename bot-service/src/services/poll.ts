import { ActionRowBuilder, ButtonBuilder, Message, TextChannel } from 'discord.js';
import { buttons, PUT_TO_A_VOTE } from '../constants/constants';
import { CommandWithArgs } from '../commands/commands';
import { votesResults } from '../utils/results/votes_results';
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
    const pollStart = await Poll.create({ question: args[0], meetingId: meeting?.meetingId }, { transaction });
    let value = args[1];
    if (args.length < 2) {
      value = args[0];
    }

    return await Voted.create({ votedFor: value, pollId: pollStart.pollId }, { transaction });
  });

  await votesResults(pollMessage, voted);
};
