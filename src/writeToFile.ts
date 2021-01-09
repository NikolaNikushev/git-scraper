import fs from 'fs';
import { envVariables } from './loadEnv';

export enum FolderName {
  Common = '/common',
  Issues = '/issues',
  PullRequest = '/pullRequest',
  User = '/user',
}

export function jsonExists(
  ownerName: string,
  repo: string,
  fileName: string,
  folder: FolderName = FolderName.Common
) {
  const dir = `${envVariables.OUTPUT_FOLDER}/${ownerName}/${repo}${folder}`;
  const filePath = `${dir}/${fileName}.json`;
  return fs.existsSync(filePath);
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
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, JSON.stringify(data));
}
