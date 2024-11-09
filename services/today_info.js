import {AGENDA} from "../constansts/constans.js";
import {stateForTodayCommand} from "../utils/states.js";

export const today_info = async (message, args) => {

    const pollChannel = message.client.channels.cache.get(process.env.POLL_CHANNEL);
    if (!pollChannel) {
        return message.channel.send('Канал для опитування не знайдено');
    }

    if(stateForTodayCommand.agenda.length > 0){
        await pollChannel.send({
            content: `** ${AGENDA}** \n${stateForTodayCommand.agenda.join("\n")}`,
        });
    }else{
        await pollChannel.send({
            content: `** ${AGENDA}** \n Відсутній `,
        });
    }
};