import {ActionRowBuilder} from 'discord.js';
import {buttons} from "../utils/constans.js";
import {votesResults} from "../utils/votesResults.js";

export const poll = async (message, args) => {
    const question = args.join(':').trim();

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
