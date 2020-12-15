import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { env } from './loadEnv';

export class Api {
  /* Private Instance Fields */

  private readonly _logger: Logger;
  private _api: Octokit;

  /* Constructor */

  constructor() {
    this._logger = Logger.getLogger({ name: this.constructor.name });
    this._api = new Octokit({
      auth: env.GITHUB_TOKEN,
      userAgent: 'git-scraper',
    });
  }

  get logger(): Logger {
    return this._logger;
  }

  get api(): Octokit {
    return this._api;
  }

  /* Public Instance Methods */

  public async loadRepo(owner: string, repo: string) {
    const { data: pullRequest } = await this._api.repos.get({
      owner,
      repo,
    });
    return pullRequest;
  }
}
