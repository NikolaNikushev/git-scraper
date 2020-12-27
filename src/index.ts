import { ProjectLoader } from './ProjectLoader';
import projects from './input.json';
import { Logger } from 'sitka';

interface Project {
  owner: string;
  repo: string;
}

const logger = Logger.getLogger({ name: 'index' });

async function loadProject(project: Project) {
  const projectLoader = new ProjectLoader(project.owner, project.repo);

  projectLoader
    .loadProject()
    .then(() => projectLoader.loadCommitActivity())
    .then(() => projectLoader.loadContributorStats())
    .then(() => projectLoader.loadContributors())
    .then((contributors) => projectLoader.loadContributorsIssues(contributors))
    .then(() => projectLoader.loadIssues())
    .then(async (issues) => {
      await projectLoader.loadIssuesComments(issues);
      const pullRequests = issues.filter((issue) =>
        Boolean(issue.pull_request)
      );
      for (const pullRequest of pullRequests) {
        await projectLoader.loadPullRequestReviews(pullRequest.number);
      }
    });
}

async function loadProjects() {
  logger.debug('Starting loading of all projects');
  for (const project of projects as Project[]) {
    await loadProject(project);
  }
}

loadProjects().then(() => {
  logger.debug('Finished loading all projects');
});
