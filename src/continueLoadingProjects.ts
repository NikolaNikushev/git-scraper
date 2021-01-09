import continueToLoadInput from './continueToLoad.json';
import { loadConnectedProjects } from './continueToLoadProjects';
import { Logger } from 'sitka';
const logger = Logger.getLogger({ name: 'continueToLoadProjects-Index' });

loadConnectedProjects(continueToLoadInput).then(() => {
  logger.debug('Finished loading all projects');
});
