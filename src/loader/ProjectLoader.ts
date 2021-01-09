import { RepoApi, IssueData, UserType } from '../api/RepoApi';
import { Logger } from 'sitka';
import { FolderName, writeToFile } from '../writeToFile';
import { writeToCSVFile } from '../toCSV';

export class ProjectLoader {
  protected api: RepoApi;
  protected logger: Logger;
  public since: Date;

  constructor(
    protected owner: string,
    protected repoName: string,
    since?: Date
  ) {
    this.logger = Logger.getLogger({ name: this.constructor.name });

    const today = new Date();
    const oneYearAgo = new Date();

    oneYearAgo.setFullYear(today.getFullYear() - 1);
    this.since = since ?? oneYearAgo;
    this.api = new RepoApi(owner, repoName, this.since);
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

        if (!stat.weeks) {
          continue;
        }

        for (const week of stat.weeks) {
          // Skip bots and anything that is not a user
          const weekTime: number = parseInt(week.w || '0', 10) * 1000; // Miliseconds

          if (
            !stat.author ||
            stat.author.type !== UserType.User ||
            weekTime < this.since.getTime() ||
            !week.c
          ) {
            continue;
          }

          const weekCommitsForAuthor = {
            owner: this.owner,
            repo: this.repoName,
            author: stat.author.login,
            week: weekTime,
            commits: week.c,
          };
          weekData.push(weekCommitsForAuthor);
        }

        await writeToCSVFile(this.owner, this.repoName, 'stats', weekData);
      }

      // This happens when no contribution was made to a forked repo.
      if (!stats[0]?.weeks) {
        return stats;
      }

      for (const week of stats[0].weeks) {
        // Skip bots and anything that is not a user
        const weekTime: number = parseInt(week.w || '0', 10) * 1000; // Miliseconds
        if (weekTime < this.since.getTime()) {
          continue;
        }

        const weekData = {
          week: weekTime,
          weekNumber: Math.ceil(
            (weekTime - this.since.getTime()) / (1000 * 3600 * 24) / 7
          ),
        };

        await writeToCSVFile(this.owner, this.repoName, 'weeks', [weekData]);
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
        });
    }
    this.logger.debug('Finished loading all user activity');
  }

  public loadIssues(): Promise<IssueData[]> {
    return this.api.loadIssues().then(async (issues) => {
      this.logger.debug('Loaded issues. Starting to load their data.', {
        totalIssues: issues.length,
      });

      writeToFile(this.owner, this.repoName, issues, 'issues');
      for (const issue of issues) {
        if (!issue.user || issue.user.type !== UserType.User) {
          continue;
        }

        const issueData = {
          owner: this.owner,
          repo: this.repoName,
          author: issue.user?.login,
          state: issue.state,
          issueId: issue.number,
          commentCount: issue.comments,
          lastUpdated: new Date(issue.updated_at).getTime(),
          createdAt: new Date(issue.created_at).getTime(),
          closedAt: issue.closed_at
            ? new Date(issue.closed_at).getTime()
            : null,
          type: issue.pull_request ? 'PR' : 'ISSUE',
        };

        await writeToCSVFile(this.owner, this.repoName, 'issues', [issueData]);
      }
      return issues;
    });
  }

  public loadIssuesComments(issues: IssueData[]) {
    return this.loadIssuesData(issues.map((issue) => issue.number));
  }

  public loadContributors() {
    return this.api.listContributors().then(async (contributors) => {
      this.logger.debug('Loaded contributors');
      writeToFile(this.owner, this.repoName, contributors, 'contributors');

      await writeToCSVFile(
        this.owner,
        this.repoName,
        'contributors',
        contributors
          .filter((el) => el.type === UserType.User)
          .map((el) => {
            return {
              login: el.login,
              owner: this.owner,
              repo: this.repoName,
              contributions: el.contributions,
            };
          })
      );

      return contributors.filter((el) => el.type === UserType.User);
    });
  }

  public async loadIssueData(issueNumber: number) {
    this.logger.debug('Starting loading of issue comments', { issueNumber });

    const comments = await this.api.listIssueComments(issueNumber);
    writeToFile(
      this.owner,
      this.repoName,
      comments,
      `issue-${issueNumber}-comments`,
      FolderName.Issues
    );

    const issueCommentsData = [];

    for (const comment of comments) {
      // Ignore bots and deleted users.
      if (!comment.user || comment.user.type !== UserType.User) {
        continue;
      }

      const commentData = {
        owner: this.owner,
        repo: this.repoName,
        author: comment.user.login,
        commentId: comment.id,
        lastUpdated: new Date(comment.updated_at).getTime(),
        createdAt: new Date(comment.created_at).getTime(),
        issueNumber,
      };
      issueCommentsData.push(commentData);
    }
    await writeToCSVFile(
      this.owner,
      this.repoName,
      'comments',
      issueCommentsData
    );

    this.logger.debug('Finished loading comments for issue', { issueNumber });
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

      const reviewData = [];

      for (const review of reviews) {
        // Ignore deleted users. Bots do not put reviews.
        if (!review.user) {
          continue;
        }

        const commentData = {
          owner: this.owner,
          repo: this.repoName,
          author: review.user.login,
          reviewId: review.id,
          state: review.state,
          submittedAt: review.submitted_at
            ? new Date(review.submitted_at).getTime()
            : null,
          pullRequestNumber,
        };
        reviewData.push(commentData);
      }
      await writeToCSVFile(this.owner, this.repoName, 'reviews', reviewData);
    }

    this.logger.debug('Finished loading of reviews', { pullRequestNumber });
  }
}
