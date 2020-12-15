import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';

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

  /**
   * Returns the total number of commits authored by the contributor.
   * In addition, the response includes a Weekly Hash (weeks array) with the following information:
   * w - Start of the week, given as a Unix timestamp.
   * a - Number of additions
   * d - Number of deletions
   * c - Number of commits
   * @param page
   */
  public async getContributorStats(page: number) {
    return this._api.repos.getContributorsStats({
      owner: this.owner,
      repo: this.repo,
      per_page: 100,
      page,
    });
  }

  /**
   * Returns the last year of commit activity grouped by week.
   * The days array is a group of commits per day, starting on Sunday.
   */
  public async getCommitActivityStatus() {
    return this._api.repos.getCommitActivityStats({
      owner: this.owner,
      repo: this.repo,
    });
  }
}
