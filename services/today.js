import {ActionRowBuilder} from 'discord.js';
import {buttons} from "../utils/constans.js";
import {votesResults} from "../utils/votesResults.js";
import {state} from "../utils/state.js";

export const today = async (message, args) => {

    const row = new ActionRowBuilder().addComponents(buttons);

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    const pollMessage = await pollChannel.send({
        content: `**Поставлено на голосування затвердження порядку денного: \n ${state.agenda.join("\n")}**`,
        components: [row],
    });

    votesResults(pollChannel,pollMessage);
};