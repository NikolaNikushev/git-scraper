import { FolderName, jsonExists } from './writeToFile';
import { envVariables } from './loadEnv';

describe('jsonExists', () => {
  it('should return true when the file exists', () => {
    envVariables.OUTPUT_FOLDER = './src/example';
    const result = jsonExists(
      'willmcgugan',
      'rich',
      'issue-1-comments',
      FolderName.Issues
    );
    expect(result).toBeTruthy();
  });
});
