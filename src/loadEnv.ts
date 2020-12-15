import dotEnv from 'dotenv';
const variables = dotEnv.config().parsed || {};

if (!variables.GITHUB_TOKEN || !variables.PRIVATE_REPO_TOKEN) {
  throw new Error(
    'Please specify the GITHUB_TOKEN environment variable in .env'
  );
}

export default variables;
