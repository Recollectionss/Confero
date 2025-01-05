import { CommandWithoutArgs } from '../commands/commands';
import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { REGISTRATION_BUTTON } from '../constants/constants';
import { registrationResults } from '../utils/registration_results';
import { Meeting } from '../db/models/meeting';

export const registry_open: CommandWithoutArgs = async (pollChannel: TextChannel) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(REGISTRATION_BUTTON);

  const pollMessage = await pollChannel.send({
    content:
      'Відкрито реєстрацію на засідання.\n ' +
      'Час відведений на реєстрацію - 5 хв. \n ' +
      'На вашу пошту буде відправлено токен який треба надіслати боту.' +
      'При відправлені спеціального токену ви автоматично даєте згоду на обробку персональних данних',
    components: [row],
  });
  const meeting = await Meeting.create();
  await registrationResults(pollMessage, meeting);
};
