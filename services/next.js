import {ActionRowBuilder} from 'discord.js';
import {buttons} from "../constansts/constans.js";
import {votesResults} from "../utils/votesResults.js";
import {stateForNextCommand} from "../utils/states.js";
import {today} from "./today.js";
// TODO: нужно дописать тут next и потом настроить сохранение данных в бд
export const next = async (message, args) => {
    const row = new ActionRowBuilder().addComponents(buttons);

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    if (stateForNextCommand.currentIndex !== 1){
        const pollMessage = await pollChannel.send({
            content: `**Поставлено на голосування: \n ${stateForNextCommand.agenda[stateForNextCommand.currentIndex]}**`,
            components: [row],
        });

        votesResults(pollChannel,pollMessage);
    }else{
        today(message,args);
    }

    stateForNextCommand.currentIndex++;

};