import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { LRUCache } from 'lru-cache';
import { firstValueFrom, shareReplay } from 'rxjs';

@Injectable()
export class ApiHelper {
  constructor(private readonly httpService: HttpService) {}

  // In-flight request map (to avoid duplicates)
  private pendingRequests = new Map<string, ReturnType<HttpService['post']>>();

  // LRU cache with TTL and max size
  private responseCache = new LRUCache<string, any>({
    max: 100, // maximum number of items
    ttl: 5 * 60 * 1000, // default TTL: 5 minutes (can be overridden per entry)
    allowStale: false,
  });

  private getRequestKey({ url, data, config }: { url: string; data?: any; config: AxiosRequestConfig }): string {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data ? { url, data, config } : { url, config }))
      .digest('hex');
    return hash;
  }

  async post<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
    ttlMs?: number, // Optional per-request TTL override
  ): Promise<unknown> {
    const key = this.getRequestKey({ url, data, config });

    // Return from cache if available
    if (this.responseCache.has(key)) {
      return this.responseCache.get(key);
    }

    // Avoid duplicate concurrent requests
    if (!this.pendingRequests.has(key)) {
      const observable = this.httpService.post<T>(url, data, config).pipe(shareReplay(1));
      this.pendingRequests.set(key, observable);

      // Cache result and cleanup
      observable.subscribe({
        next: (response) => {
          this.responseCache.set(key, response.data, { ttl: ttlMs }); // set with custom or default TTL
        },
        complete: () => this.pendingRequests.delete(key),
        error: () => this.pendingRequests.delete(key),
      });
    }

    const sharedResponse$ = this.pendingRequests.get(key);
    const response = await firstValueFrom(sharedResponse$);
    return response.data;
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    ttlMs?: number, // Optional per-request TTL override
  ): Promise<unknown> {
    const key = this.getRequestKey({ url, config });

    // Return from cache if available
    if (this.responseCache.has(key)) {
      return this.responseCache.get(key);
    }

    // Avoid duplicate concurrent requests
    if (!this.pendingRequests.has(key)) {
      const observable = this.httpService.get<T>(url, config).pipe(shareReplay(1));
      this.pendingRequests.set(key, observable);

      // Cache result and cleanup
      observable.subscribe({
        next: (response) => {
          this.responseCache.set(key, response.data, { ttl: ttlMs }); // set with custom or default TTL
        },
        complete: () => this.pendingRequests.delete(key),
        error: () => this.pendingRequests.delete(key),
      });
    }

    const sharedResponse$ = this.pendingRequests.get(key);
    const response = await firstValueFrom(sharedResponse$);
    return response.data;
  }

  async put<T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<unknown> {
    const key = this.getRequestKey({ url, config });

    // Avoid duplicate concurrent requests
    if (!this.pendingRequests.has(key)) {
      const observable = this.httpService.put<T>(url, data, config).pipe(shareReplay(1));
      this.pendingRequests.set(key, observable);

      // Cache result and cleanup
      observable.subscribe({
        complete: () => this.pendingRequests.delete(key),
        error: () => this.pendingRequests.delete(key),
      });
    }

    const sharedResponse$ = this.pendingRequests.get(key);
    const response = await firstValueFrom(sharedResponse$);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<unknown> {
    const key = this.getRequestKey({ url, config });

    // Avoid duplicate concurrent requests
    if (!this.pendingRequests.has(key)) {
      const observable = this.httpService.delete<T>(url, config).pipe(shareReplay(1));
      this.pendingRequests.set(key, observable);

      // Cache result and cleanup
      observable.subscribe({
        complete: () => this.pendingRequests.delete(key),
        error: () => this.pendingRequests.delete(key),
      });
    }

    const sharedResponse$ = this.pendingRequests.get(key);
    const response = await firstValueFrom(sharedResponse$);
    return response.data;
  }
}
