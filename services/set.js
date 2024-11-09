import {stateForTodayCommand, stateForNextCommand} from '../utils/states.js';
import {APPROVAL_OF_THE_AGENDA, CLOSE_OF_THE_MEETING, OPEN_OF_THE_MEETING} from "../constansts/constans.js";

export const set = async (message, args) => {
    const items = args.join(':').split("/");
    let count = 0;

    stateForNextCommand.agenda.push(OPEN_OF_THE_MEETING);
    stateForNextCommand.agenda.push(APPROVAL_OF_THE_AGENDA);

    items.forEach(el => {
        count++;
        el.trimStart();
        if (el.includes("|")) {
            const cleanedItem = el.split('|');

            stateForTodayCommand.agenda.push(addNumber() + cleanedItem[0]);
            stateForNextCommand.agenda.push(cleanedItem[1]);

            message.channel.send(`Пункт "${cleanedItem[0]}" додано, але при !next: буде ${cleanedItem[1]}!`);
        }else{
            stateForTodayCommand.agenda.push(addNumber() + el);
            stateForNextCommand.agenda.push(el);
            message.channel.send(`Пункт "${el}" додано.`);
        }
    })

    count++;
    stateForNextCommand.agenda.push(count + '.' +CLOSE_OF_THE_MEETING);

    stateForTodayCommand.agenda.push(addNumber() + "РІЗНЕ")

    function addNumber ()  {
        return count + '.';
    }
};
