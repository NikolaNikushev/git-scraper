import { Api } from './Api';

export interface IssueData {
  number: number;
  pull_request?: any;
}

export enum UserType {
  User = 'User',
}

export class RepoApi extends Api {
  /* Private Instance Fields */

  /* Constructor */

  constructor(private owner: string, private repo: string, public since: Date) {
    super();
  }

  /* Public Instance Methods */

  public async loadRepo() {
    const { data: repoData } = await this.api.repos.get({
      owner: this.owner,
      repo: this.repo,
    });
    return repoData;
  }

  public async listContributors() {
    return this.api.paginate(this.api.repos.listContributors, {
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
    return this.api.paginate(this.api.repos.getContributorsStats, {
      owner: this.owner,
      repo: this.repo,
    });
  }

  /**
   * Returns the last year of commit activity grouped by week.
   * The days array is a group of commits per day, starting on Sunday.
   */
  public async getCommitActivityStatus() {
    return this.api.repos.getCommitActivityStats({
      owner: this.owner,
      repo: this.repo,
    });
  }

  /**
   * Loads all the issues created by a user.
   * Pull requests are considered
   */
  public async loadUserIssuesForRepo(user: string) {
    return this.api.paginate(this.api.issues.listForRepo, {
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
    return this.api.paginate(this.api.issues.listComments, {
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
    return this.api.paginate(this.api.issues.listForRepo, {
      owner: this.owner,
      repo: this.repo,
      state: 'all',
      since: this.since.toISOString(),
    });
  }

  /**
   * Returns all the public events for a repository
   */
  public async getPullRequestReviews(pullRequestNumber: number) {
    return this.api.paginate(this.api.pulls.listReviews, {
      owner: this.owner,
      repo: this.repo,
      pull_number: pullRequestNumber,
    });
  }
}
