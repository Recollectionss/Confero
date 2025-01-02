import { TARGET_VOTES, TIME_TO_VOTE } from '../constants/constants';
import { ButtonComponent, ComponentType, Message, TextChannel } from 'discord.js';
import { User } from '../db/models/user';

type Votes = {
  for: number;
  against: number;
  abstain: number;
};
// TODO: Треба реалізувати виведення всіх хто голосував
export const votesResults = async (pollChannel: TextChannel, pollMessage: Message) => {
  const votes: Votes = { for: 0, against: 0, abstain: 0 };
  let totalVotes = 0;
  const voters = new Map();

  const collector = pollMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TIME_TO_VOTE,
  });

  collector.on('collect', async (interaction) => {
    const userId: string = interaction.user.id;
    const vote: string = interaction.customId;
    const user = await User.findOne({ where: { discordId: userId } });

    if (!user) {
      await interaction.reply({ content: 'У вас немає прав голосувати', ephemeral: true });
      return;
    }
    if (!(vote in votes)) {
      await interaction.reply({ content: 'Недійсний голос!', ephemeral: true });
      return;
    }

    if (voters.has(userId)) {
      const userVote = voters.get(userId);
      votes[vote as keyof Votes] += 1;
      votes[userVote.now as keyof Votes] -= 1;
      userVote.now = vote;

      await interaction.reply({
        content: `Ви змінили голос на: ${(interaction.component as ButtonComponent).label}`,
        ephemeral: true,
      });
      return;
    }

    voters.set(userId, { now: vote });

    if (Object.prototype.hasOwnProperty.call(votes, vote)) {
      votes[vote as keyof Votes] += 1;
      totalVotes++;
      await interaction.reply({
        content: `Ваш голос за: ${(interaction.component as ButtonComponent).label}`,
        ephemeral: true,
      });

      if (totalVotes >= TARGET_VOTES) {
        collector.stop('vote_target_reached');
      }
    }
  });

  collector.on('end', (reason: string) => {
    let resultMessage: string;

    // eslint-disable-next-line max-len
    resultMessage = `Результати голосування:\nЗА: ${votes.for}\nПроти: ${votes.against}\nУтримуюсь: ${votes.abstain}\n \n`;
    if (totalVotes < 6) {
      resultMessage += 'Рішення не прийнято недостатня кількість голосів';
      pollChannel.send(resultMessage);
      return;
    }

    if (reason === 'vote_target_reached') {
      if (votes.for === totalVotes) {
        resultMessage += `Єдиноголосно ЗА — рішення прийнято.`;
      } else if (votes.against === totalVotes) {
        resultMessage += `Єдиноголосно ПРОТИ — рішення не прийнято.`;
      } else if (votes.abstain === totalVotes) {
        resultMessage += `Єдиноголосно УТРИМУЮСЬ — рішення не прийнято.`;
      }

      pollChannel.send(resultMessage);
      return;
    }

    if (votes.for > votes.against + votes.abstain) {
      resultMessage += 'Рішення прийнято.';
    } else {
      resultMessage += 'Рішення не прийнято.';
    }

    pollChannel.send(resultMessage);
  });
};
