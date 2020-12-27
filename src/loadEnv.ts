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

interface EnvVariables {
  GITHUB_TOKEN: string;
  OUTPUT_FOLDER: string;
}

export const envVariables: EnvVariables = {
  GITHUB_TOKEN: githubToken,
  OUTPUT_FOLDER: outputFolder,
};
