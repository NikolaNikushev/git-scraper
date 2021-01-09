import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';
export const RATE_LIMIT = 4900;
export abstract class Api {
  /* Private Instance Fields */
  static requestCount = 0;
  private readonly _logger: Logger;
  private readonly _api: Octokit;
  /* Constructor */

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
    this._api = customOctokit;
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
