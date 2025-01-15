import { CommandWithoutArgs } from '../commands/commands';
import { ActionRowBuilder, ButtonBuilder, TextChannel } from 'discord.js';
import { REGISTRATION_BUTTON } from '../constants/constants';
import { registrationResults } from '../utils/registration_results';
import { Meeting } from '../db/models/meeting';

export const registry_open: CommandWithoutArgs = async (channel: TextChannel) => {
  // TODO: треба буде реалізувати можливість видалити активне засідання
  // const activeMeetingExist = await Meeting.findOne({ where: { isActive: true } });
  // eslint-disable-next-line max-len
  // const commandChannel: TextChannel = (await client.channels.fetch(ENV_CONSTANTS.discord.pollChannel)) as TextChannel;
  // if (activeMeetingExist) {
  //   await commandChannel.send('Існує вже активне засідання чи видалити його? (Так/Ні)');
  //   const collector = commandChannel.createMessageCollector({
  //     time: TIME_TO_VOTE,
  //   });
  //   collector.on('collect', async (message) => {
  //     if (message.author.bot) {
  //       return;
  //     }
  //     if(message.content === 'Так'){
  //       commandChannel.send('')
  //     }
  //   });
  // }
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(REGISTRATION_BUTTON);

  const pollMessage = await channel.send({
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
