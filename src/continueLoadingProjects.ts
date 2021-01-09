import continueToLoadInput from './continueToLoad.json';
import { Logger } from 'sitka';
import { loadProject, Project } from './index';

const logger = Logger.getLogger({ name: 'continueLoadingProjects' });

export async function loadConnectedProjects(projectsToLoad: Project[]) {
  logger.debug('Continuing loading of projects', {
    totalProjects: projectsToLoad.length,
  });

  for (let index = 0; index < projectsToLoad.length; index++) {
    const project = projectsToLoad[index];
    await loadProject(project, true);
    logger.debug('Finished loading connected project', {
      total: projectsToLoad.length,
      index,
    });
  }
}

loadConnectedProjects(continueToLoadInput).then(() => {
  logger.debug('Finished loading all projects');
});
