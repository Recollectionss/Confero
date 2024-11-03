import {ActionRowBuilder} from 'discord.js';
import {buttons} from "../utils/constans.js";
import {votesResults} from "../utils/votesResults.js";
// TODO: нужно дописать тут next и потом настроить сохранение данных в бд
export const poll = async (message, args) => {
    const row = new ActionRowBuilder().addComponents(buttons);

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    const pollMessage = await pollChannel.send({
        content: `**Поставлено на голосування: \n ${question}**`,
        components: [row],
    });

    votesResults(pollChannel,pollMessage);
};