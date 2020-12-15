import dotEnv from 'dotenv';
const variables = dotEnv.config().parsed || {};
const githubToken = (variables.GITHUB_TOKEN ||
  !variables.PRIVATE_REPO_TOKEN) as string;
if (!githubToken) {
  throw new Error(
    'Please specify the GITHUB_TOKEN environment variable in .env'
  );
}

interface EnvVariables {
  GITHUB_TOKEN: string;
}

export const env: EnvVariables = { GITHUB_TOKEN: githubToken };
