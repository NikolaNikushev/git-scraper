import { ProjectLoader } from './loader/ProjectLoader';
import { writeToCSVFile } from './toCSV';
import { envVariables } from './loadEnv';
// tslint:disable-next-line:no-implicit-dependencies no-submodule-imports
import { Api } from './api/Api';
import { Contributor } from './api/UserApi';
import { Logger } from 'sitka';

export interface Project {
  owner: string;
  repo: string;
}
const logger = Logger.getLogger({ name: 'project-loader' });

export async function loadProject(project: Project): Promise<Contributor[]> {
  const projectLoader = new ProjectLoader(project.owner, project.repo);

  return projectLoader
    .loadProject()
    .then(() => projectLoader.loadCommitActivity())
    .then(() => projectLoader.loadContributorStats())
    .then(() => projectLoader.loadIssues())
    .then(async (issues) => {
      await projectLoader.loadIssuesComments(issues);
      const pullRequests = issues.filter((issue) =>
        Boolean(issue.pull_request)
      );
      for (const pullRequest of pullRequests) {
        await projectLoader.loadPullRequestReviews(pullRequest.number);
      }
    })
    .then(() => projectLoader.loadContributors())
    .then((contributors) =>
      projectLoader.loadContributorsIssues(contributors).then(async () => {
        await writeToCSVFile(project.owner, project.repo, 'repos', [project]);
        await writeToCSVFile('connectedRepos', 'toLoad', 'loaded', [project]);
        return contributors;
      })
    )
    .catch((err) => {
      if (err.message.toLowerCase().includes('rate limit')) {
        logger.error('API Rate limit reached.');

        if (envVariables.RETRY_ON_RATE_LIMIT_REACHED && Api.nextReset) {
          const retryIn = Api.nextReset - new Date().getTime() + 5000;
          logger.info('Going to retry to load project', {
            project,
            retryIn: retryIn / 1000,
          });
          return new Promise((resolve) => {
            setTimeout(
              () =>
                loadProject(project)
                  .then((result) => {
                    return resolve(result as []);
                  })
                  .catch((innerError) => {
                    logger.error('Error loading project. Skipping...', {
                      innerError,
                      project,
                    });
                    return [];
                  }),
              retryIn
            );
          });
        }
        throw err;
      }

      logger.error('Failed loading of project data. Continuing with next.', {
        message: err.message,
        err,
      });
      return [];
    });
}
