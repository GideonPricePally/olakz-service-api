import { Injectable } from '@nestjs/common';
import csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class CsvService {
  async parseCsv(filePath: string, data_formatter: (data: unknown) => unknown): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data_formatter(data)))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}
