import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';
export const RATE_LIMIT = 4900;
export abstract class Api {
  static requestCount = 0;
  private readonly _logger: Logger;
  private readonly _api: Octokit;
  static resourceRates: { core: number; rate: number };

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
    this._api = customOctokit;
    if (!Api.resourceRates) {
      this._api.rateLimit.get().then((limit) => {
        this._logger.info('Rate limits', {
          rate: limit.data.rate,
          resources: {
            core: limit.data.resources.core,
            search: limit.data.resources.search,
            source_import: limit.data.resources.source_import,
          },
        });
        Api.resourceRates = {
          core: limit.data.resources.core.remaining,
          rate: limit.data.rate.remaining,
        };
      });
    }
  }

  get logger(): Logger {
    return this._logger;
  }

  get api(): Octokit {
    Api.requestCount++;
    // const rates = Api.resourceRates;

    // if(Api.requestCount > RATE_LIMIT || (rates && (rates.core < 50 || rates.rate < 50) )) {
    //   throw new Error('SORRY. Rate limit reached. Continue in 1h');
    // }

    return this._api;
  }
}
