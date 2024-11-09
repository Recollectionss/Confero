import {poll} from "../services/poll.js";
import {open} from "../services/open.js"
import {close} from "../services/close.js"
import {set} from "../services/set.js";
import {today} from "../services/today.js";
import {next} from "../services/next.js";
import {today_info} from "../services/today_info.js";

export const commands = {
    poll,
    open,
    close,
    set,
    today,
    today_info,
    next
}