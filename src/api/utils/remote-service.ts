import { Injectable } from '@nestjs/common';
import axios, { CreateAxiosDefaults } from 'axios';

@Injectable()
export class RemoteService {
  getInstance(config?: CreateAxiosDefaults) {
    return axios.create(config);
  }
}
