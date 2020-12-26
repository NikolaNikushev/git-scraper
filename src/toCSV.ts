import { createObjectCsvWriter } from 'csv-writer';
import { Logger } from 'sitka';
export interface Header {
  id: string;
  title: string;
}
const logger = Logger.getLogger({ name: 'toCSV' });

export function writeToCSVFile(fileName: string, headers: Header[], data: any) {
  const path = `${fileName}.csv`;
  const csvWriter = createObjectCsvWriter({
    path,
    header: headers,
  });

  csvWriter
    .writeRecords(data)
    .then(() =>
      logger.debug('The CSV file was written successfully', { path })
    );
}
