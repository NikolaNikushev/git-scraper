import { ProjectLoader } from './loader/ProjectLoader';
import projects from './input.json';
import fs from 'fs';
import { Logger } from 'sitka';
import rimraf from 'rimraf';
import { getCSVOutputFolder, writeToCSVFile } from './toCSV';
import { envVariables } from './loadEnv';
// tslint:disable-next-line:no-implicit-dependencies no-submodule-imports
import { components } from '@octokit/openapi-types/generated/types';
import { ContributorLoader } from './loader/ContributorLoader';
import { Api, RATE_LIMIT } from './api/Api';
import { loadConnectedProjects } from './continueLoadingProjects';

export interface Project {
  owner: string;
  repo: string;
}

const logger = Logger.getLogger({ name: 'index' });

export async function loadProject(project: Project, connected: boolean) {
  const projectLoader = new ProjectLoader(
    project.owner,
    project.repo,
    connected
  );

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
        if (connected) {
          await writeToCSVFile('connectedRepos', 'toLoad', 'loaded', [project]);
        }
        return contributors;
      })
    )
    .catch((err) => {
      if (err.message.toLowerCase().includes('rate limit')) {
        logger.error('API Rate limit reached.');
        Api.requestCount = RATE_LIMIT + 5;
        throw err;
      }
      logger.error('Failed loading of project data. Continuing with next.', {
        message: err.message,
        err,
      });
      return [];
    });
}

function clearOldData() {
  const singleFile = envVariables.SINGLE_CSV_FILE;
  if (singleFile) {
    const csvFolder = getCSVOutputFolder();
    if (fs.existsSync(csvFolder)) {
      rimraf.sync(csvFolder);
    }
    return;
  }

  for (const project of projects as Project[]) {
    const csvFolder = getCSVOutputFolder(project.owner, project.repo);
    if (fs.existsSync(csvFolder)) {
      rimraf.sync(csvFolder);
    }
  }
}

async function loadProjects() {
  logger.debug('Starting loading of projects', {
    totalProjects: projects.length,
  });
  if (projects.length > 0) {
    return;
  }

  clearOldData();

  let connectedReposToLoad: components['schemas']['minimal-repository'][] = [];
  const loadedContributors: string[] = [];

  for (const project of projects as Project[]) {
    const contributors = await loadProject(project, false);

    // For each contributors add their top 10 projects that have been working on
    for (const contributor of contributors) {
      const login = contributor.login;

      if (!login) {
        continue;
      }

      if (loadedContributors.includes(login)) {
        continue;
      }

      const contributorLoader = new ContributorLoader(login);
      const { data } = await contributorLoader.getRecentlyUpdatedRepos();
      loadedContributors.push(login);

      // Remove duplicates & forked repos

      const newData = data
        .filter(({ fork }) => !fork)
        .filter(
          (loadedRepo) =>
            !Boolean(
              connectedReposToLoad.find(
                (repo) =>
                  loadedRepo.name === repo.name &&
                  loadedRepo.owner &&
                  loadedRepo.owner.login === repo.owner?.login
              )
            )
        );

      connectedReposToLoad = connectedReposToLoad.concat(newData);
    }
  }

  // Remove already loaded
  connectedReposToLoad = connectedReposToLoad.filter(
    (newProjectToLoad) =>
      !Boolean(
        projects.find(
          (project) =>
            project.repo === newProjectToLoad.name &&
            project.owner === newProjectToLoad.owner?.login
        )
      )
  );

  // Only include the ones that have an owner.
  connectedReposToLoad = connectedReposToLoad.filter(({ owner }) =>
    Boolean(owner)
  );

  logger.debug('New repos to load: ', {
    total: connectedReposToLoad.length,
  });

  const mappedProjects = connectedReposToLoad.map(({ name, owner }) => {
    return { repo: name, owner: owner?.login };
  }) as Project[];

  await writeToCSVFile('connectedRepos', 'toLoad', 'toLoad', mappedProjects);

  await loadConnectedProjects(mappedProjects);
}

loadProjects().then(() => {
  logger.debug('Finished loading all projects');
});
