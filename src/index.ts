import { Api } from './api';
import { Logger } from 'sitka';
import fs from 'fs';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

const logger = Logger.getLogger({ name: 'index' });
let api: Api;

function loadProject() {
  return api.loadRepo();
}

function writeToFile(
  ownerName: string,
  repo: string,
  data: object,
  fileName: string
): void {
  const dir = `./src/exampleApiOutput/${ownerName}/${repo}`;
  fs.mkdirSync(dir, { recursive: true });
  const filePath = `${dir}/${fileName}.json`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}

function loadContributorStats(
  page: number = 0
): Promise<
  RestEndpointMethodTypes['repos']['getContributorsStats']['response']
> {
  let contributors: RestEndpointMethodTypes['repos']['getContributorsStats']['response'];
  return api.getContributorStats(page).then(async (stats) => {
    logger.debug(`Loading getContributorStats page=${page}`);
    if (contributors) {
      contributors.data = contributors.data.concat(stats.data);
    } else {
      contributors = stats;
    }
    if (stats.data.length === 100) {
      const newData = await loadContributorStats(page + 1);
      contributors.data = contributors.data.concat(newData.data);
    }
    return contributors;
  });
}

const owner = 'willmcgugan';
const repoName = 'rich';
api = new Api(owner, repoName);

loadProject()
  .then((repo) => {
    logger.debug('Loaded project', { name: repo.name });
    // has active issues: repo.open_issues_count
    // default branch repo.default_branch

    if (!repo.owner) {
      logger.error('Repo has no owner.', { name: repo.name });
      return;
    }
    writeToFile(owner, repoName, repo, 'repo');
  })
  .then(() => {
    return api.listContributors().then((contributors) => {
      logger.debug('Loaded contributors');
      writeToFile(owner, repoName, contributors, 'contributors');
    });
  })
  .then(() => {
    return loadContributorStats().then((stats) => {
      logger.debug('getContributorStats', stats.data.length);
      writeToFile(owner, repoName, stats, 'stats');
    });
  });
