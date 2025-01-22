import { Transaction } from 'sequelize';
import { RegistrationOnMeeting } from '../db/models';
import { Meeting } from '../db/models/meeting';
import { Poll } from '../db/models/poll';
import { OPEN_OF_THE_MEETING } from '../constants/constants';
import { Voted } from '../db/models/voted';

export class Validator {
  constructor(private readonly transaction: Transaction) {}

  async checkMeeting(meeting: Meeting) {
    if (!meeting) {
      throw new Error('Ви не можете створити голосування без відкритого засідання');
    }
    return this;
  }
  async checkOpenPoll(meetingId: string) {
    const openPoll = await Poll.findOne({
      where: {
        question: OPEN_OF_THE_MEETING,
        meetingId: meetingId,
      },
      transaction: this.transaction,
    });
    const voted = await Voted.findOne({ where: { pollId: openPoll?.pollId, result: true } });

    if (!openPoll || !voted) {
      throw new Error('Ви не можете створити голосування без відкритого засідання');
    }
    return this;
  }

  async checkRegisteredUsers(meetingId: string) {
    const registeredUserCount = await RegistrationOnMeeting.count({
      where: {
        meetingId: meetingId,
        userVerified: true,
      },
      transaction: this.transaction,
    });

    if (registeredUserCount < 6) {
      throw new Error('Недостатня кількість зареєстрованих делегатів для відкриття засідання');
    }
    return this;
  }

  async checkExistPoll() {
    const poll = await Poll.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['pollId', 'question'],
      transaction: this.transaction,
    });
    if (!poll) {
      throw new Error('Не можна створити vote без існуючого poll');
    }
    return this;
  }
}
