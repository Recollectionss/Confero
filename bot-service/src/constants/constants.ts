import { ButtonBuilder, ButtonStyle } from 'discord.js';

export const VOTING_OPTIONS = {
  FOR: 'За',
  AGAINST: 'Проти',
  ABSTAINED: 'Утримався',
  NOT_VOTED: 'Не голосував/ла',
} as const;

export const buttons: ButtonBuilder[] = [
  new ButtonBuilder().setCustomId(VOTING_OPTIONS.FOR).setLabel(VOTING_OPTIONS.FOR).setStyle(ButtonStyle.Success),
  new ButtonBuilder().setCustomId(VOTING_OPTIONS.AGAINST).setLabel(VOTING_OPTIONS.AGAINST).setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setCustomId(VOTING_OPTIONS.ABSTAINED)
    .setLabel(VOTING_OPTIONS.ABSTAINED)
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId(VOTING_OPTIONS.NOT_VOTED).setLabel('Відмінити голос').setStyle(ButtonStyle.Secondary),
];
export const REGISTRATION_BUTTON: ButtonBuilder = new ButtonBuilder()
  .setCustomId('registrationButton')
  .setLabel('Зараєструватись')
  .setStyle(ButtonStyle.Primary);

export const TIME_TO_VOTE = 5 * 60 * 1000;
export const TARGET_VOTES = 11;

export const PUT_TO_A_VOTE = '**Поставлено на голосування**';

export const OPEN_OF_THE_MEETING = 'Відкриття засідання';
export const CLOSE_OF_THE_MEETING = 'Закриття засідання';

export const POSTGRES = 'postgres';

export const HELP_COMMAND_TEXT = `**Список команд:**\n
**Для створення опитування:**
\`\`\`
!help:            - Відобразити інформацію по командах
!registry_open:   - Відкриття реєстрації на засідання
!open:            - Відкриття засідання
!close:           - Закриття засідання
!poll: 1& | 2&    - Опитування на тему "1&", а голосування за "2&" 
(2& аргумент не обов'язковий, при його відсутності буде взято 1&)
!add_vote: 1&     - Додатковий пункт для минулого голосування
!get_results:     - Виведення всіх результатів голосувань під час засідання
\`\`\`

*Всі команди повинні починатися зі знака оклику (!) для коректного виконання.*`;
