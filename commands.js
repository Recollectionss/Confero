import {poll} from "./services/poll.js";
import {open} from "./services/open.js"
import {close} from"./services/close.js"
import {set} from "./services/set.js";
import {today} from "./services/today.js";
import {next} from "./services/next.js";

export const commands = {
    poll,
    open,
    close,
    set,
    today,
    next
}