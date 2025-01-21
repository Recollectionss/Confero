import { ButtonBuilder, ButtonStyle } from 'discord.js';

export const VOTING_OPTIONS = {
  FOR: 'За',
  AGAINST: 'Проти',
  ABSTAINED: 'Утримався',
  NOT_VOTED: 'Не голосував/ла',
} as const;

export const buttons: ButtonBuilder[] = [
  new ButtonBuilder().setCustomId(VOTING_OPTIONS.FOR).setLabel(VOTING_OPTIONS.FOR).setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId(VOTING_OPTIONS.AGAINST).setLabel(VOTING_OPTIONS.AGAINST).setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setCustomId(VOTING_OPTIONS.ABSTAINED)
    .setLabel(VOTING_OPTIONS.ABSTAINED)
    .setStyle(ButtonStyle.Secondary),
];
export const REGISTRATION_BUTTON: ButtonBuilder = new ButtonBuilder()
  .setCustomId('registrationButton')
  .setLabel('Зараєструватись')
  .setStyle(ButtonStyle.Primary);

export const TIME_TO_VOTE = 0.5 /*2*/ * 60 * 1000;
export const TARGET_VOTES = 11;

export const PUT_TO_A_VOTE = '**Поставлено на голосування**';

export const OPEN_OF_THE_MEETING = 'Відкриття засідання';
export const CLOSE_OF_THE_MEETING = 'Закриття засідання';

export const APPROVAL_OF_THE_AGENDA = 'затвердження порядку денного';
export const AGENDA = 'Порядок денний';

export const POSTGRES = 'postgres';
