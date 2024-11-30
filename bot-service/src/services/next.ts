import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { buttons } from '../constansts/constans';
import { votesResults } from 'utils/votesResults';
import { stateForNextCommand } from 'utils/states';
import { today } from './today';
// TODO: нужно дописать тут next и потом настроить сохранение данных в бд
export const next = async (message, args, pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  if (stateForNextCommand.currentIndex !== 1) {
    const pollMessage = await pollChannel.send({
      content: `**Поставлено на голосування** \n ${stateForNextCommand.agenda[stateForNextCommand.currentIndex]}`,
      components: [row],
    });

    votesResults(pollChannel, pollMessage);
  } else {
    today(message, args);
  }

  stateForNextCommand.currentIndex++;
};
