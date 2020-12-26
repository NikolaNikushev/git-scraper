import { Logger } from 'sitka';
import { Octokit } from '@octokit/rest';
import { customOctokit } from './CustomOctokit';

export interface IssueData {
  number: number;
  pull_request?: any;
}

export class Api {
  /* Private Instance Fields */

  private readonly _logger: Logger;
  private readonly _api: Octokit;
  /* Constructor */

  constructor(private owner: string, private repo: string, public since: Date) {
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
    const { data: repoData } = await this._api.repos.get({
      owner: this.owner,
      repo: this.repo,
    });
    return repoData;
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
   */
  public async getContributorStats() {
    return this._api.paginate(this._api.repos.getContributorsStats, {
      owner: this.owner,
      repo: this.repo,
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

  /**
   * Loads all the issues created by a user.
   * Pull requests are considered
   */
  public async loadUserIssuesForRepo(user: string) {
    return this._api.paginate(this._api.issues.listForRepo, {
      owner: this.owner,
      repo: this.repo,
      state: 'all',
      creator: user,
      since: this.since.toISOString(),
    });
  }

  /**
   * Returns all the comments for a specific issue.
   * Pull requests are considered issues as well
   */
  public async listIssueComments(issueNumber: number) {
    return this._api.paginate(this._api.issues.listComments, {
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      since: this.since.toISOString(),
    });
  }

  /**
   * Returns all the comments for a specific issue.
   * Pull requests are considered issues as well
   */
  public async loadIssues() {
    return this._api.paginate(this._api.issues.listForRepo, {
      owner: this.owner,
      repo: this.repo,
      state: 'all',
      since: this.since.toISOString(),
    });
  }

  /**
   * Returns all the comments for a specific issue.
   * Pull requests are considered issues as well
   */
  public async getIssueInformation(issueNumber: number) {
    return this._api.issues.get({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
    });
  }

  /**
   * Returns all the public events for a repository
   */
  public async getPullRequestReviews(pullRequestNumber: number) {
    return this._api.paginate(this._api.pulls.listReviews, {
      owner: this.owner,
      repo: this.repo,
      pull_number: pullRequestNumber,
    });
  }
}
