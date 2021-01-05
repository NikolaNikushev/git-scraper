import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { envVariables } from './loadEnv';
export interface Header {
  id: string;
  title: string;
}

export function getCSVOutputFolder(ownerName?: string, repo?: string) {
  const groupPath = envVariables.SINGLE_CSV_FILE
    ? ''
    : `/${ownerName}/${repo}/`;
  return `${envVariables.OUTPUT_FOLDER}/csv/${groupPath}`;
}

export function writeToCSVFile(
  ownerName: string,
  repo: string,
  fileName: string,
  data: any,
  headers?: Header[]
) {
  const dir = getCSVOutputFolder(ownerName, repo);
  fs.mkdirSync(dir, { recursive: true });
  const path = `${dir}/${fileName}.csv`;

  if (!headers || headers.length <= 0) {
    if (!data || Object.keys(data).length <= 0) {
      return Promise.resolve();
    }

    headers = Object.keys(data[0]).map((key) => {
      return {
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
      };
    });
  }

  const csvWriter = createObjectCsvWriter({
    path,
    header: headers,
    append: false,
  });
  if (!fs.existsSync(path)) {
    return csvWriter.writeRecords(data);
  }

  return appendToFile(path, data, headers);
}

function appendToFile(path: string, data: any, headers?: Header[]) {
  if (!headers || headers.length <= 0) {
    return Promise.reject('No header provided');
  }
  const appendWriter = createObjectCsvWriter({
    path,
    header: headers,
    append: true,
  });
  return appendWriter.writeRecords(data);
}
