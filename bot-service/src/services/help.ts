import { TextChannel } from 'discord.js';
import { CommandWithoutArgs } from '../commands/commands';

export const help: CommandWithoutArgs = async (commandChannel: TextChannel) => {
  await commandChannel.send(
    `**Список команд:**\n
**Для створення опитування:**
\`\`\`
!poll: &&          - Опитування на тему "&&"
!open:            - Відкриття засідання
!close:           - Закриття засідання
\`\`\`

*Всі команди повинні починатися зі знака оклику (!) для коректного виконання.*`,
  );
};
