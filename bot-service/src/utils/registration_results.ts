import { ComponentType, Message, TextChannel } from 'discord.js';
import { TIME_TO_VOTE } from '../constants/constants';

export const registrationResults = async (message: Message, channel: TextChannel) => {
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TIME_TO_VOTE,
  });

  collector.on('collect', (collected) => {
    const userId: string = collected?.user?.id;
  });
};
