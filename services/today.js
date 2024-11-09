import {ActionRowBuilder} from 'discord.js';
import {APPROVAL_OF_THE_AGENDA, buttons} from "../constansts/constans.js";
import {votesResults} from "../utils/votesResults.js";
import {stateForTodayCommand} from "../utils/states.js";

export const today = async (message, args) => {

    const row = new ActionRowBuilder().addComponents(buttons);

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    const pollMessage = await pollChannel.send({
        content: `**Поставлено на голосування ${APPROVAL_OF_THE_AGENDA}: ${stateForTodayCommand.agenda.join("\n")}**`,
        components: [row],
    });

    votesResults(pollChannel,pollMessage);
};