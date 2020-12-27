import fs from 'fs';
import { envVariables } from './loadEnv';

export enum FolderName {
  Common = '/common',
  Issues = '/issues',
  PullRequest = '/pullRequest',
  User = '/user',
}

export function writeToFile(
  ownerName: string,
  repo: string,
  data: object | [],
  fileName: string,
  folder: FolderName = FolderName.Common
): void {
  const dir = `${envVariables.OUTPUT_FOLDER}/${ownerName}/${repo}${folder}`;
  fs.mkdirSync(dir, { recursive: true });
  const filePath = `${dir}/${fileName}.json`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}
