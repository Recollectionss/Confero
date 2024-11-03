import {state, stateForNextCommand} from '../utils/state.js';
import {poll} from "./poll.js";

export const set = async (message, args) => {
    const item = args.join(':').split("/");

    item.forEach(el => {
        el.trimStart();
        if (el.includes("|")) {
            stateForNextCommand.agenda.push(`Пункт "${cleanedItem}" додано, але при !next: буде пропущено!.`)

            const cleanedItem = el.replace(/\|/g, '');
            state.agenda.push(cleanedItem);

            message.channel.send(`Пункт "${cleanedItem}" додано, але при !next: буде пропущено!.`);
        }else{
            state.agenda.push(el);
            message.channel.send(`Пункт "${el}" додано.`);
        }
    })
};
