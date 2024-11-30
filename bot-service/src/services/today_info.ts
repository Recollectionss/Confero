import { AGENDA } from '../constansts/constans';
import { stateForTodayCommand } from 'utils/states';
import { TextChannel } from 'discord.js';

export const today_info = async (message, args, pollChannel: TextChannel) => {
  const pollChannel = message.client.channels.cache.get(
    process.env.POLL_CHANNEL,
  );
  if (!pollChannel) {
    return message.channel.send('Канал для опитування не знайдено');
  }

  if (stateForTodayCommand.agenda.length > 0) {
    await pollChannel.send({
      content: `** ${AGENDA}** \n${stateForTodayCommand.agenda.join('\n')}`,
    });
  } else {
    await pollChannel.send({
      content: `** ${AGENDA}** \n Відсутній `,
    });
  }
};
