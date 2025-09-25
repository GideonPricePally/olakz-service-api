import { Injectable, InternalServerErrorException, Logger, NestMiddleware } from '@nestjs/common';
// import { toNodeHandler } from 'better-auth/node';
import { NextFunction, Request, Response } from 'express';

// import { auth } from './auth';

@Injectable()
export class BetterAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BetterAuthMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // const authHandler = toNodeHandler(auth);
      // await authHandler(req, res);
      if (!res.writableEnded) {
        next(); // Only continue to next middleware/handler if not handled by auth
      }
    } catch (error) {
      this.logger.error('Error in auth middleware:', error);
      throw new InternalServerErrorException('Authentication failed');
    }
  }
}
