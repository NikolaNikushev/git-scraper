import { ProjectLoader } from './ProjectLoader';

const owner = 'willmcgugan';
const repoName = 'rich';
const projectLoader = new ProjectLoader(owner, repoName);

projectLoader
  .loadProject()
  .then(() => projectLoader.loadCommitActivity())
  .then(() => projectLoader.loadContributorStats())
  .then(() => projectLoader.loadContributors())
  .then((contributors) => projectLoader.loadContributorsIssues(contributors))
  .then(() => projectLoader.loadIssues())
  .then(async (issues) => {
    await projectLoader.loadIssuesComments(issues);
    const pullRequests = issues.filter((issue) => Boolean(issue.pull_request));
    for (const pullRequest of pullRequests) {
      await projectLoader.loadPullRequestReviews(pullRequest.number);
    }
  });
