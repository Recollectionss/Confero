import {ActionRowBuilder} from "discord.js";
import {buttons, OPEN_OF_THE_MEETING} from "../constansts/constans.js";
import {votesResults} from "../utils/votesResults.js";

export const open = async (message, args) => {
    const row = new ActionRowBuilder().addComponents(buttons);

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    const pollMessage = await pollChannel.send({
        content: `**Поставлено на голосування** \n ${OPEN_OF_THE_MEETING}`,
        components: [row],
    });

    votesResults(pollChannel,pollMessage);
};