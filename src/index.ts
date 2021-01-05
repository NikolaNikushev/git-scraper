import { ProjectLoader } from './ProjectLoader';
import projects from './input.json';
import fs from 'fs';
import { Logger } from 'sitka';
import rimraf from 'rimraf';
import { getCSVOutputFolder, writeToCSVFile } from './toCSV';
import { envVariables } from './loadEnv';

interface Project {
  owner: string;
  repo: string;
}

const logger = Logger.getLogger({ name: 'index' });

async function loadProject(project: Project) {
  const projectLoader = new ProjectLoader(project.owner, project.repo);

  return projectLoader
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

function clearOldData() {
  const singleFile = envVariables.SINGLE_CSV_FILE;
  if (singleFile) {
    const csvFolder = getCSVOutputFolder();
    if (fs.existsSync(csvFolder)) {
      rimraf.sync(csvFolder);
    }
  } else {
    for (const project of projects as Project[]) {
      const csvFolder = getCSVOutputFolder(project.owner, project.repo);
      if (fs.existsSync(csvFolder)) {
        rimraf.sync(csvFolder);
      }
    }
  }
}

async function loadProjects() {
  logger.debug('Starting loading of projects', {
    totalProjects: projects.length,
  });

  clearOldData();

  for (const project of projects as Project[]) {
    await loadProject(project);
    await writeToCSVFile(project.owner, project.repo, 'repos', [project]);
  }
}

loadProjects().then(() => {
  logger.debug('Finished loading all projects');
});
