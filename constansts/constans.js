import {ButtonBuilder, ButtonStyle} from "discord.js";

export const buttons = [
    new ButtonBuilder().setCustomId('for').setLabel('ЗА').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('against').setLabel('Проти').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('abstain').setLabel('Утримуюсь').setStyle(ButtonStyle.Secondary),
];
export const TIME_TO_VOTE = 0.5 * 60 * 1000;
export const TARGET_VOTES = 11;

export const OPEN_OF_THE_MEETING = "Відкриття засідання";
export const CLOSE_OF_THE_MEETING = "Закриття засідання";

export const APPROVAL_OF_THE_AGENDA = "затвердження порядку денного";