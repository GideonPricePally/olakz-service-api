export type AppConfig = {
  app_username: string;
  nodeEnv: string;
  isDevelopment: boolean;
  name: string;
  url: string;
  port: number;
  debug: boolean;
  apiPrefix: string;
  fallbackLanguage: string;
  logLevel: string;
  logService: string;
  corsOrigin: boolean | string | RegExp | (string | RegExp)[];
};
