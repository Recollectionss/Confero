import {state, stateForNextCommand} from '../utils/state.js';
import {poll} from "./poll.js";

export const set = async (message, args) => {
    const item = args.join(':').split("/");

    item.forEach(el => {
        el.trimStart();
        if (el.includes("|")) {
            const cleanedItem = el.split('|');
            state.agenda.push(cleanedItem[0]);
            stateForNextCommand.agenda.push(cleanedItem[1]);

            message.channel.send(`Пункт "${cleanedItem[0]}" додано, але при !next: буде ${cleanedItem[1]}!.`);
        }else{
            state.agenda.push(el);
            stateForNextCommand.agenda.push(el);
            message.channel.send(`Пункт "${el}" додано.`);
        }
    })
};
