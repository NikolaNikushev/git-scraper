import fs from 'fs';

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
  const outputFolder = process.env.OUTPUT_FOLDER ?? './src/example';
  const dir = `${outputFolder}/${ownerName}/${repo}${folder}`;
  fs.mkdirSync(dir, { recursive: true });
  const filePath = `${dir}/${fileName}.json`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}
