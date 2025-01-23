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
  open: [createMiddlewareChain('checkRegisteredUsers')],
  poll: [createMiddlewareChain('meetingIsOpen', 'lastVotedClosed')],
  add_vote: [createMiddlewareChain('meetingIsOpen', 'checkExistPoll', 'lastVotedClosed')],
  close: [createMiddlewareChain('meetingIsOpen', 'lastVotedClosed')],
};
