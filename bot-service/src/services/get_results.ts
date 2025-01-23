import { Meeting } from '../db/models/meeting';
import { Poll } from '../db/models/poll';
import { RegistrationOnMeeting, sequelize, User, UserVoice } from '../db/models';
import { Voted } from '../db/models/voted';
import { VOTING_OPTIONS } from '../constants/constants';
import { CommandWithoutArgs } from '../commands/commands';

export const getResults: CommandWithoutArgs = async (channel) => {
  const [meeting, registeredUsers] = await sequelize.transaction(async (transaction) => {
    const meeting = (await Meeting.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['meetingId'],
      transaction,
    })) as Meeting;
    const registeredUsers = await RegistrationOnMeeting.findAll({
      where: {
        meetingId: meeting.meetingId,
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['name'],
        },
      ],
      transaction,
    });
    return [meeting, registeredUsers];
  });

  let result: string = 'Зареєстровані делегати: \n\n';
  for (const registered of registeredUsers) {
    const user = registered.User as User;
    result += `${user.name} - ${registered.userVerified ? 'Зареєстрований' : 'Незареєстрований'} \n`;
  }

  const polls = await Poll.findAll({ where: { meetingId: meeting.meetingId } });
  result += '\nПорядок денний: \n\n';
  polls.forEach((poll, index) => {
    result += `${index}. ${poll.question} \n`;
  });
  await channel.send(result);

  for (const poll of polls) {
    await channel.send(await getResultFromPoll(poll));
  }
};

const getResultFromPoll = async (poll: Poll): Promise<string> => {
  let result = `${poll.question} \n`;
  const voteds = await Voted.findAll({ where: { pollId: poll.pollId } });

  for (const voted of voteds) {
    result += `${poll.question === voted.votedFor ? '' : voted.votedFor} - ${voted.result}`;
    const usersVoices = await UserVoice.findAll({
      where: {
        votedId: voted.votedId,
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['name'],
        },
      ],
    });

    const votes = {
      [VOTING_OPTIONS.FOR]: 0,
      [VOTING_OPTIONS.AGAINST]: 0,
      [VOTING_OPTIONS.ABSTAINED]: 0,
      [VOTING_OPTIONS.NOT_VOTED]: 0,
    };

    usersVoices.forEach((userVoice) => {
      result += `${userVoice.User?.name} - ${userVoice.voice} \n`;
      if (Object.keys(votes).includes(userVoice.voice)) {
        votes[userVoice.voice]++;
      }
    });
    result += `\nРезультати голосування:
        ЗА: ${votes[VOTING_OPTIONS.FOR]}
        Проти: ${votes[VOTING_OPTIONS.AGAINST]}
        Утримуюсь: ${votes[VOTING_OPTIONS.ABSTAINED]}
        Не голосувало: ${votes[VOTING_OPTIONS.NOT_VOTED]}
        \n`;
  }
  return result;
};
