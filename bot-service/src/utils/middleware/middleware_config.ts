import { Transaction } from 'sequelize';
import { MiddlewareValidator } from './middleware_validator';

export type MiddlewareFunction = (transaction: Transaction) => Promise<void>;

const createMiddlewareChain = (...validators: Array<keyof MiddlewareValidator>) => {
  return async (transaction: Transaction) => {
    const middlewareValidator = new MiddlewareValidator(transaction);
    for (const validator of validators) {
      if (typeof middlewareValidator[validator] === 'function') {
        await middlewareValidator[validator]();
      }
    }
  };
};

export const middlewareConfig: Record<string, MiddlewareFunction[]> = {
  registry_open: [createMiddlewareChain('activeMeetingExist')],
  open: [createMiddlewareChain('activeMeetingExist', 'checkRegisteredUsers')],
  poll: [createMiddlewareChain('activeMeetingExist', 'checkRegisteredUsers', 'meetingIsOpen')],
  add_vote: [createMiddlewareChain('activeMeetingExist', 'checkRegisteredUsers', 'meetingIsOpen', 'checkExistPoll')],
  close: [createMiddlewareChain('activeMeetingExist', 'checkRegisteredUsers', 'meetingIsOpen')],
};
