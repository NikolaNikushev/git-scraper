import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';
export abstract class Api {
  private readonly _logger: Logger;
  private readonly _api: Octokit;
  static nextReset: number = 0;

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
    this._api = customOctokit;
    this._api.rateLimit.get().then((limit) => {
      this._logger.info('Rate limits', {
        rate: limit.data.rate,
        resources: {
          core: limit.data.resources.core,
          search: limit.data.resources.search,
          source_import: limit.data.resources.source_import,
        },
      });
      Api.nextReset = limit.data.rate.reset * 1000;
    });
  }

  get logger(): Logger {
    return this._logger;
  }

  get api(): Octokit {
    return this._api;
  }
}
