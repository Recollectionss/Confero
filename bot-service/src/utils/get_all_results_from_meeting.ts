import { TextChannel } from 'discord.js';
import { Meeting } from '../db/models/meeting';
import { Poll } from '../db/models/poll';
import { RegistrationOnMeeting, User, UserVoice } from '../db/models';
import { Voted } from '../db/models/voted';

export const getAllResultsFromMeeting = async (channel: TextChannel, meeting: Meeting) => {
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
  });
  let result: string = 'Зареєстровані делегати: \n';
  registeredUsers.forEach((registration) => {
    const user = registration.User as User;
    result += `${user.name} - ${registration.userVerified ? 'Зареєстрований' : 'Незареєстрований'} \n`;
  });

  const polls = await Poll.findAll({ where: { meetingId: meeting.meetingId } });
  result += 'Порядок денний: \n';
  polls.forEach((poll, index) => {
    result += `${index}. ${poll.question}`;
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
    result += `${poll.question === voted.votedFor ? '' : voted.votedFor}`;
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

    usersVoices.forEach((userVoice) => {
      result += `${userVoice.User?.name} - ${userVoice.voice}`;
    });
  }
  return result;
};
