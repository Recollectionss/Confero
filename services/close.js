import {ActionRowBuilder} from "discord.js";
import {buttons, CLOSE_OF_THE_MEETING} from "../constansts/constans.js";
import {votesResults} from "../utils/votesResults.js";

export const close = async (message, args) => {
    const row = new ActionRowBuilder().addComponents(buttons);

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    const pollMessage = await pollChannel.send({
        content: `**Поставлено на голосування: \n ${CLOSE_OF_THE_MEETING}**`,
        components: [row],
    });

    votesResults(pollChannel,pollMessage);
};