import { Logger } from 'sitka';
import { loadProject, Project } from './loadProject';

const logger = Logger.getLogger({ name: 'continueToLoadProjects' });

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
