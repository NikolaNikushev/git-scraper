import { ProjectLoader } from './ProjectLoader';
import rimraf from 'rimraf';

describe('ProjectLoader', () => {
  describe('loadContributorStats', () => {
    beforeEach(() => {
      rimraf.sync('./src/example/csv');
    });

    it('should load contributors status and put into a CSV', async () => {
      const projectLoader = new ProjectLoader('willmcgugan', 'rich');
      await projectLoader.loadContributorStats();
    });
  });
});
