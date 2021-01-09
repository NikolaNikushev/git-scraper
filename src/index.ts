import projects from './input.json';
import { ContributorLoader } from './loader/ContributorLoader';
import { getCSVOutputFolder, writeToCSVFile } from './toCSV';
import { loadProject, Project } from './loadProject';
import { Logger } from 'sitka';
// tslint:disable-next-line:no-implicit-dependencies no-submodule-imports
import { components } from '@octokit/openapi-types/generated/types';
import { envVariables } from './loadEnv';
import fs from 'fs';
import rimraf from 'rimraf';
import { loadConnectedProjects } from './continueToLoadProjects';
const logger = Logger.getLogger({ name: 'index' });

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
