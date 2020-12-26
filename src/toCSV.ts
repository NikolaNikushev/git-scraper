import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
export interface Header {
  id: string;
  title: string;
}

export function writeToCSVFile(
  ownerName: string,
  repo: string,
  fileName: string,
  data: any,
  headers?: Header[]
) {
  const outputFolder = process.env.OUTPUT_FOLDER ?? './src/example';
  const dir = `${outputFolder}/csv/${ownerName}/${repo}/${fileName}`;
  fs.mkdirSync(dir, { recursive: true });
  const path = `${dir}/${fileName}.csv`;

  if (!headers || headers.length <= 0) {
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
    return csvWriter
      .writeRecords(data)
      .then(() => appendToFile(path, data, headers));
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
