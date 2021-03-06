import dotEnv from 'dotenv';
const variables = dotEnv.config().parsed || {};
const githubToken = (variables.GITHUB_TOKEN ||
  !variables.PRIVATE_REPO_TOKEN) as string;
if (!githubToken) {
  throw new Error(
    'Please specify the GITHUB_TOKEN environment variable in .env'
  );
}

const outputFolder = variables.OUTPUT_FOLDER ?? './src/example';
const singleFile = variables.SINGLE_CSV_FILE === 'true';
const retryOnRateLimitReached =
  variables.RETRY_ON_RATE_LIMIT_REACHED === 'true';

interface EnvVariables {
  GITHUB_TOKEN: string;
  OUTPUT_FOLDER: string;
  SINGLE_CSV_FILE: boolean;
  RETRY_ON_RATE_LIMIT_REACHED: boolean;
}

export const envVariables: EnvVariables = {
  GITHUB_TOKEN: githubToken,
  OUTPUT_FOLDER: outputFolder,
  SINGLE_CSV_FILE: singleFile,
  RETRY_ON_RATE_LIMIT_REACHED: retryOnRateLimitReached,
};
