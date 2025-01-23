import { Transaction } from 'sequelize';
import { middlewareConfig, MiddlewareFunction } from './middleware_config';
import { sequelize } from '../../db/db_connect';

export class Middleware {
  private readonly middlewares: MiddlewareFunction[] = [];

  constructor(command: string) {
    this.middlewares = middlewareConfig[command] || [];
  }

  async use() {
    await sequelize.transaction(async (transaction: Transaction) => {
      for (const middleware of this.middlewares) {
        await middleware(transaction);
      }
    });
  }
}
