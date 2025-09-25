import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  constructor() {}
  error(message: string | Record<string, unknown>): void {
    console.error(message);
  }
  log(message: string | Record<string, unknown>): void {
    console.error(message);
  }
}
