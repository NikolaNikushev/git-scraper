import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';
export const RATE_LIMIT = 4900;
export abstract class Api {
  static requestCount = 0;
  private readonly _logger: Logger;
  private readonly _api: Octokit;

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
    this._api = customOctokit;
    this._api.rateLimit.get().then((limit) => {
      this._logger.info('Rate limits', { limits: limit.data });
    });
  }

  get logger(): Logger {
    return this._logger;
  }

  get api(): Octokit {
    Api.requestCount++;
    if (Api.requestCount > RATE_LIMIT) {
      throw new Error('SORRY. Rate limit reached. Continue in 1h');
    }

    return this._api;
  }
}
