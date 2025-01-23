import { TARGET_VOTES, TIME_TO_VOTE, VOTING_OPTIONS } from '../../constants/constants';
import { ButtonComponent, ButtonInteraction, ComponentType, Message, TextChannel } from 'discord.js';
import { RegistrationOnMeeting, User } from '../../db/models';
import { Voted } from '../../db/models/voted';
import { Meeting } from '../../db/models/meeting';
import { UserVoice } from '../../db/models';

export const votesResults = async (message: Message, voted: Voted) => {
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TIME_TO_VOTE,
  });
  let totalVotes = 0;

  collector.on('collect', async (interaction) => {
    if (await collectInteraction(interaction, voted.votedId)) {
      totalVotes++;
    }
    if (totalVotes >= TARGET_VOTES) {
      collector.stop('vote_target_reached');
    }
  });

  collector.on('end', async (reason: string) => {
    await collectNotVotedUsers(voted.votedId);
    await sendResultsVoting(voted, reason, totalVotes, message.channel as TextChannel);
  });
};
const collectInteraction = async (interaction: ButtonInteraction, votedId: number) => {
  const userId: string = interaction.user.id;
  const vote = isVotingOption(interaction.customId) ? interaction.customId : null;
  const meeting = await Meeting.findOne({ where: { isActive: true } });
  const user = await User.findByPk(userId);
  const registeredUser = await RegistrationOnMeeting.findOne({
    where: { meetingId: meeting?.meetingId, userId: userId },
  });

  if (!user || !registeredUser || !registeredUser.userVerified) {
    await interaction.reply({ content: 'У вас немає прав голосувати', ephemeral: true });
    return;
  }
  if (vote === null) {
    await interaction.reply({ content: 'Недійсний голос!', ephemeral: true });
    return;
  }

  const userVoiceExist = await UserVoice.findOne({ where: { votedId: votedId, userId: user.userId } });
  if (userVoiceExist) {
    userVoiceExist.voice = vote;
    userVoiceExist.save();

    await interaction.reply({
      content: `Ви змінили голос на: ${(interaction.component as ButtonComponent).label}`,
      ephemeral: true,
    });
    return false;
  } else {
    await UserVoice.create({
      voice: vote,
      votedId: votedId,
      userId: user.userId,
    });
    await interaction.reply({
      content: `Ваш голос за: ${(interaction.component as ButtonComponent).label}`,
      ephemeral: true,
    });
    return true;
  }
};

const collectNotVotedUsers = async (votedId: number) => {
  const meeting = await Meeting.findOne({ where: { isActive: true } });
  const registeredUsers = await RegistrationOnMeeting.findAll({
    where: { meetingId: meeting?.meetingId, userVerified: true },
  });

  const votedUsers = await UserVoice.findAll({
    where: { votedId },
    attributes: ['userId'],
  });

  const votedUserIds = new Set(votedUsers.map((user) => user.userId));

  const notVotedUsers = registeredUsers.filter((user) => !votedUserIds.has(user.userId));

  for (const user of notVotedUsers) {
    await UserVoice.create({
      userId: user.userId,
      votedId,
      voice: VOTING_OPTIONS.NOT_VOTED,
    });
  }
};

const sendResultsVoting = async (voted: Voted, reason: string, totalVotes: number, channel: TextChannel) => {
  const users = await UserVoice.findAll({ where: { votedId: voted.votedId } });
  const votes = {
    [VOTING_OPTIONS.FOR]: 0,
    [VOTING_OPTIONS.AGAINST]: 0,
    [VOTING_OPTIONS.ABSTAINED]: 0,
    [VOTING_OPTIONS.NOT_VOTED]: 0,
  };

  users.forEach((user) => {
    if (votes.hasOwnProperty(user.voice)) {
      votes[user.voice]++;
    } else {
      votes['Не голосував/ла']++;
    }
  });
  if (
    votes[VOTING_OPTIONS.FOR] >
    votes[VOTING_OPTIONS.AGAINST] + votes[VOTING_OPTIONS.ABSTAINED] + votes[VOTING_OPTIONS.NOT_VOTED]
  ) {
    voted.result = 'Рішення прийнято.';
  } else {
    voted.result = 'Рішення не прийнято.';
  }
  let resultMessage: string;

  resultMessage = `Результати голосування:
        ЗА: ${votes[VOTING_OPTIONS.FOR]}
        Проти: ${votes[VOTING_OPTIONS.AGAINST]}
        Утримуюсь: ${votes[VOTING_OPTIONS.ABSTAINED]}
        Не голосувало: ${votes[VOTING_OPTIONS.NOT_VOTED]}
        `;

  if (reason === 'vote_target_reached') {
    const votesResults = {
      [VOTING_OPTIONS.FOR]: `Єдиноголосно ЗА — рішення прийнято.`,
      [VOTING_OPTIONS.AGAINST]: `Єдиноголосно ПРОТИ — рішення не прийнято.`,
      [VOTING_OPTIONS.ABSTAINED]: `Єдиноголосно УТРИМУЮСЬ — рішення не прийнято.`,
      [VOTING_OPTIONS.NOT_VOTED]: `Єдиноголосно Не голосував/ла — рішення не прийнято.`,
    };

    const votesResultsOption = Object.entries(votes).find(([, count]) => count === totalVotes);

    if (votesResultsOption) {
      resultMessage += `${votesResults[votesResultsOption[0] as keyof typeof votesResults]}`;
    }

    await channel.send(resultMessage);
    return;
  }
  if (totalVotes < 6) {
    resultMessage += 'Рішення не прийнято недостатня кількість голосів';
    await channel.send(resultMessage);
    return;
  }

  if (
    votes[VOTING_OPTIONS.FOR] >
    votes[VOTING_OPTIONS.AGAINST] + votes[VOTING_OPTIONS.ABSTAINED] + votes[VOTING_OPTIONS.NOT_VOTED]
  ) {
    resultMessage += 'Рішення прийнято.';
  } else {
    resultMessage += 'Рішення не прийнято.';
  }

  await channel.send(resultMessage);
  return;
};

export const isVotingOption = (value: string): value is 'За' | 'Проти' | 'Утримався' | 'Не голосував/ла' => {
  return Object.values(VOTING_OPTIONS).includes(value as any);
};
