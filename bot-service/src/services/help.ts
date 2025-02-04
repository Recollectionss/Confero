import { TextChannel } from 'discord.js';
import { CommandWithoutArgs } from '../commands/commands';

export const help: CommandWithoutArgs = async (commandChannel: TextChannel) => {
  await commandChannel.send(
    `**Список команд:**\n
**Для створення опитування:**
\`\`\`
!registry_open:   - Відкриття реєстрації на засідання
!open:            - Відкриття засідання
!close:           - Закриття засідання
!poll: 1& | 2&    - Опитування на тему "1&", а голосування за "2&" 
(2& аргумент не обов'язковий, при його відсутності буде взято 1&)
!add_vote: 1&     - Додатковий пункт для минулого голосування
\`\`\`

*Всі команди повинні починатися зі знака оклику (!) для коректного виконання.*`,
  );
};
