import { ProjectLoader } from './ProjectLoader';
import contributors from '../src/example/willmcgugan/rich/common/contributors.json';
import rimraf from 'rimraf';

describe('ProjectLoader', () => {
  describe('loadContributorStats', () => {
    const projectLoader = new ProjectLoader('willmcgugan', 'rich');
    beforeEach(() => {
      rimraf.sync('./src/example/csv');
    });

    it('should load contributors status and put into a CSV', async () => {
      await projectLoader.loadContributorStats();
    });

    it('should load contributors status and put into a CSV', async () => {
      jest.setTimeout(30000);
      await projectLoader.loadContributorsIssues(contributors);
    });
  });
});
