import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

export class Api {
  /* Private Instance Fields */

  private readonly _logger: Logger;
  private readonly _api: Octokit;

  /* Constructor */

  constructor(private owner: string, private repo: string) {
    this._logger = Logger.getLogger({ name: this.constructor.name });
    this._api = customOctokit;
  }

  get logger(): Logger {
    return this._logger;
  }

  get api(): Octokit {
    return this._api;
  }

  /* Public Instance Methods */

  public async loadRepo() {
    const { data: pullRequest } = await this._api.repos.get({
      owner: this.owner,
      repo: this.repo,
    });
    return pullRequest;
  }

  public async listContributors() {
    return this._api.repos.listContributors({
      owner: this.owner,
      repo: this.repo,
    });
  }

  public async getContributorStats(
    page: number
  ): Promise<
    RestEndpointMethodTypes['repos']['getContributorsStats']['response']
  > {
    return this._api.repos.getContributorsStats({
      owner: this.owner,
      repo: this.repo,
      per_page: 100,
      page,
    });
  }
}
