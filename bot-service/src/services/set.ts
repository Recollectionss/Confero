import { stateForTodayCommand, stateForNextCommand } from '../utils/states';
import { APPROVAL_OF_THE_AGENDA, CLOSE_OF_THE_MEETING, OPEN_OF_THE_MEETING } from '../constants/constants';
import { Message, TextChannel } from 'discord.js';
import { CommandWithArgs } from '../commands/commands';

export const set: CommandWithArgs = async (message: Message, args: string[]) => {
  const commandChannel = message.channel as TextChannel;
  let count = 0;

  stateForNextCommand.agenda.push(OPEN_OF_THE_MEETING);
  stateForNextCommand.agenda.push(APPROVAL_OF_THE_AGENDA);

  args.forEach((el) => {
    count++;
    el.trimStart();
    if (el.includes('|')) {
      const cleanedItem = el.split('|');

      stateForTodayCommand.agenda.push(addNumber() + cleanedItem[0]);
      stateForNextCommand.agenda.push(cleanedItem[1]);

      commandChannel.send(`Пункт "${cleanedItem[0]}" додано, але при !next: буде ${cleanedItem[1]}!`);
    } else {
      stateForTodayCommand.agenda.push(addNumber() + el);
      stateForNextCommand.agenda.push(el);
      commandChannel.send(`Пункт "${el}" додано.`);
    }
  });

  count++;
  stateForTodayCommand.agenda.push(addNumber() + 'РІЗНЕ');

  stateForNextCommand.agenda.push(CLOSE_OF_THE_MEETING);

  function addNumber() {
    return count + '.';
  }
};
