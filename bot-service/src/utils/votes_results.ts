import { TARGET_VOTES, TIME_TO_VOTE, VOTING_OPTIONS } from '../constants/constants';
import { ButtonComponent, ComponentType, Message, TextChannel } from 'discord.js';
import { RegistrationOnMeeting, User } from '../db/models';
import { Voted } from '../db/models/voted';
import { Meeting } from '../db/models/meeting';
import { UserVoice } from '../db/models/user_voice';

// TODO: Треба реалізувати виведення всіх хто голосував
export const votesResults = async (message: Message, voted: Voted) => {
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TIME_TO_VOTE,
  });
  let totalVotes = 0;

  collector.on('collect', async (interaction) => {
    const userId: string = interaction.user.id;
    const vote = isVotingOption(interaction.customId) ? interaction.customId : null;
    const meeting = await Meeting.findOne({
      order: [['createdAt', 'DESC']],
    });
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

    const userVoiceExist = await UserVoice.findOne({ where: { votedId: voted.votedId, userId: user.userId } });
    if (userVoiceExist) {
      userVoiceExist.voice = vote;
      userVoiceExist.save();

      await interaction.reply({
        content: `Ви змінили голос на: ${(interaction.component as ButtonComponent).label}`,
        ephemeral: true,
      });
    } else {
      await UserVoice.create({
        voice: vote,
        voteId: voted.votedId,
        userId: user.userId,
      });
      await interaction.reply({
        content: `Ваш голос за: ${(interaction.component as ButtonComponent).label}`,
        ephemeral: true,
      });
      totalVotes++;
    }
    if (totalVotes >= TARGET_VOTES) {
      collector.stop('vote_target_reached');
    }
  });

  // collector.on('end', (reason: string) => {
  //   let resultMessage: string;
  //
  // eslint-disable-next-line max-len
  //   resultMessage = `Результати голосування:\nЗА: ${votes.for}\nПроти: ${votes.against}\nУтримуюсь: ${votes.abstain}\n \n`;
  //   if (totalVotes < 6) {
  //     resultMessage += 'Рішення не прийнято недостатня кількість голосів';
  //     (message.channel as TextChannel).send(resultMessage);
  //     return;
  //   }
  //
  //   if (reason === 'vote_target_reached') {
  //     if (votes.for === totalVotes) {
  //       resultMessage += `Єдиноголосно ЗА — рішення прийнято.`;
  //     } else if (votes.against === totalVotes) {
  //       resultMessage += `Єдиноголосно ПРОТИ — рішення не прийнято.`;
  //     } else if (votes.abstain === totalVotes) {
  //       resultMessage += `Єдиноголосно УТРИМУЮСЬ — рішення не прийнято.`;
  //     }
  //
  //     (message.channel as TextChannel).send(resultMessage);
  //     return;
  //   }
  //
  //   if (votes.for > votes.against + votes.abstain) {
  //     resultMessage += 'Рішення прийнято.';
  //   } else {
  //     resultMessage += 'Рішення не прийнято.';
  //   }
  //
  //   (message.channel as TextChannel).send(resultMessage);
  // });
};

export const isVotingOption = (value: string): value is 'За' | 'Проти' | 'Утримався' | 'Не голосував' => {
  return Object.values(VOTING_OPTIONS).includes(value as any);
};
