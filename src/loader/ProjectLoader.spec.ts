import { ProjectLoader } from './ProjectLoader';
import rimraf from 'rimraf';

describe('ProjectLoader', () => {
  describe('loadContributorStats', () => {
    const projectLoader = new ProjectLoader('willmcgugan', 'rich');
    beforeEach(() => {
      rimraf.sync('./src/example/csv');
    });

    it('should load contributors status and put into a CSV', async () => {
      await projectLoader.loadContributorStats();
      // TODO add test for loading into CSV for stats
    });

    // TODO add test for loading into CSV for issues
    // TODO add test for loading into CSV for reviews
    // TODO add test for loading into CSV for contributors
    // TODO add test for loading into CSV for comments
  });
});
