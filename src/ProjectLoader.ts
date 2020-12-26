import { Api, IssueData } from './api';
import { Logger } from 'sitka';
import { FolderName, writeToFile } from './writeToFile';
import { writeToCSVFile } from './toCSV';

export class ProjectLoader {
  protected api: Api;
  protected logger: Logger;
  constructor(
    protected owner: string,
    protected repoName: string,
    public since?: Date
  ) {
    this.logger = Logger.getLogger({ name: this.constructor.name });

    const today = new Date();
    const oneYearAgo = new Date();

    oneYearAgo.setFullYear(today.getFullYear() - 1);
    this.api = new Api(owner, repoName, since ?? oneYearAgo);
  }

  public loadProject() {
    return this.api.loadRepo().then((repo) => {
      this.logger.debug('Loaded project', { name: repo.name });
      // has active issues: repo.open_issues_count
      // default branch repo.default_branch

      if (!repo.owner) {
        this.logger.error('Repo has no owner.', { name: repo.name });
        return;
      }
      writeToFile(this.owner, this.repoName, repo, 'repo');
    });
  }

  public loadCommitActivity() {
    return this.api.getCommitActivityStatus().then((commitStatus) => {
      this.logger.debug('Storing commit activity');
      writeToFile(
        this.owner,
        this.repoName,
        commitStatus.data,
        'commitActivity'
      );
    });
  }

  public loadContributorStats() {
    return this.api.getContributorStats().then(async (stats) => {
      this.logger.debug('Total contributors:', { total: stats.length });
      writeToFile(this.owner, this.repoName, stats, 'stats');

      for (const stat of stats) {
        const weekData = [];

        for (const week of stat.weeks) {
          const weekCommitsForAuthor = {
            repo: this.repoName,
            author: stat.author?.login,
            week: week.w,
            commits: week.c,
          };
          weekData.push(weekCommitsForAuthor);
        }

        await writeToCSVFile(this.owner, this.repoName, 'stats', weekData);
      }
      return stats;
    });
  }

  public async loadContributorsIssues(contributors: { login?: string }[]) {
    for (const contributor of contributors) {
      this.logger.debug('Starting process to load user', {
        user: contributor.login,
      });
      if (!contributor.login) {
        continue;
      }
      await this.api
        .loadUserIssuesForRepo(contributor.login)
        .then(async (userIssues) => {
          this.logger.debug('Loaded user issues', {
            user: contributor.login,
            totalIssues: userIssues.length,
          });
          writeToFile(
            this.owner,
            this.repoName,
            userIssues,
            `issues-${contributor.login}`,
            FolderName.User
          );
          const userIssuesData = [];
          for (const issue of userIssues) {
            const issuesByUser = {
              repo: this.repoName,
              author: contributor.login,
              state: issue.state,
              issueId: issue.number,
              commentCount: issue.comments,
              type: issue.pull_request ? 'PR' : 'ISSUE',
            };
            userIssuesData.push(issuesByUser);
          }

          await writeToCSVFile(
            this.owner,
            this.repoName,
            'issues',
            userIssuesData
          );
        });
    }
    this.logger.debug('Finished loading all user activity');
  }

  public loadIssues(): Promise<IssueData[]> {
    return this.api.loadIssues().then((issues) => {
      this.logger.debug('Loaded issues. Starting to load their data.', {
        totalIssues: issues.length,
      });
      writeToFile(this.owner, this.repoName, issues, 'issues');
      return issues;
    });
  }

  public loadIssuesComments(issues: IssueData[]) {
    return this.loadIssuesData(issues.map((issue) => issue.number));
  }

  public loadContributors() {
    return this.api.listContributors().then((contributors) => {
      this.logger.debug('Loaded contributors');
      writeToFile(this.owner, this.repoName, contributors, 'contributors');
      writeToCSVFile(
        this.owner,
        this.repoName,
        'contributors',
        contributors.filter((el) => el.type === 'User'),
        [
          { id: 'login', title: 'User' },
          { id: 'contributions', title: 'Contributions' },
        ]
      );
      return contributors;
    });
  }

  public async loadIssueData(issueNumber: number) {
    this.logger.debug('Starting loading of issue', { issueNumber });

    const comments = await this.api.listIssueComments(issueNumber);
    writeToFile(
      this.owner,
      this.repoName,
      comments,
      `issue-${issueNumber}-comments`,
      FolderName.Issues
    );

    const information = await this.api.getIssueInformation(issueNumber);
    writeToFile(
      this.owner,
      this.repoName,
      information.data,
      `issue-${issueNumber}-information`,
      FolderName.Issues
    );
    this.logger.debug('Finished loading of issue', { issueNumber });
  }

  public async loadIssuesData(issueNumbers: number[]) {
    for (const issueNumber of issueNumbers) {
      await this.loadIssueData(issueNumber);
    }

    this.logger.debug('Finished loading issues and their comments');
  }

  public async loadPullRequestReviews(pullRequestNumber: number) {
    this.logger.debug('Starting loading of pull request data', {
      pullRequestNumber,
    });

    const reviews = await this.api.getPullRequestReviews(pullRequestNumber);
    if (reviews.length > 0) {
      writeToFile(
        this.owner,
        this.repoName,
        reviews,
        `pull-request-${pullRequestNumber}`,
        FolderName.PullRequest
      );
    }

    this.logger.debug('Finished loading of reviews', { pullRequestNumber });
  }
}
