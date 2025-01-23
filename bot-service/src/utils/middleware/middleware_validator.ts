import { Transaction } from 'sequelize';
import { RegistrationOnMeeting } from '../../db/models';
import { Meeting } from '../../db/models/meeting';
import { Poll } from '../../db/models/poll';
import { OPEN_OF_THE_MEETING } from '../../constants/constants';
import { Voted } from '../../db/models/voted';

export class MiddlewareValidator {
  constructor(private readonly transaction: Transaction) {}

  async activeMeetingExist() {
    const meeting = await Meeting.findOne({
      where: { isActive: true },
      attributes: ['meetingId'],
      transaction: this.transaction,
    });
    if (meeting) {
      throw new Error('Існує вже відкрите засідання');
    }
    return this;
  }
  async meetingIsOpen() {
    const meeting = await Meeting.findOne({
      where: { isActive: true },
      attributes: ['meetingId'],
      transaction: this.transaction,
    });
    const openPoll = await Poll.findOne({
      where: {
        question: OPEN_OF_THE_MEETING,
        meetingId: meeting?.meetingId,
      },
      transaction: this.transaction,
    });
    const voted = await Voted.findOne({ where: { pollId: openPoll?.pollId, result: true } });

    if (!openPoll || !voted) {
      throw new Error('Ви не можете створити голосування без відкритого засідання');
    }
    return this;
  }

  async checkRegisteredUsers() {
    const meeting = await Meeting.findOne({
      where: { isActive: true },
      attributes: ['meetingId'],
      transaction: this.transaction,
    });
    const registeredUserCount = await RegistrationOnMeeting.count({
      where: {
        meetingId: meeting?.meetingId,
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
      attributes: ['pollId'],
      transaction: this.transaction,
    });
    if (!poll) {
      throw new Error('Не можна створити vote без існуючого poll');
    }
    return this;
  }

  async lastVotedClosed() {
    const poll = await Poll.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['pollId'],
      transaction: this.transaction,
    });
    if (!poll) {
      return this;
    }
    const voted = await Voted.findOne({
      where: { pollId: poll?.pollId },
      order: [['createdAt', 'DESC']],
      attributes: ['result'],
      transaction: this.transaction,
    });
    if (!voted?.result) {
      throw new Error('Останнє голосування не було закінчене, зачекайта.');
    }
  }
}
