import { CommandWithoutArgs } from '../commands/commands';
import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { REGISTRATION_BUTTON } from '../constants/constants';
import { registrationResults } from '../utils/registration_results';

export const registry_open: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(REGISTRATION_BUTTON);

  const pollMessage = await pollChannel.send({
    content: 'Відкрито реєстрацію на засідання\n Час відведений на реєстрацію - 5 хв',
    components: [row],
  });

  await registrationResults(pollMessage, pollChannel);
};
