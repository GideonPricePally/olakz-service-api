import { AuthService } from '@/api/auth/auth.service';
import { UserService } from '@/api/user/user.service';
import { IS_ADMIN, IS_AUTH, IS_AUTH_OPTIONAL, IS_PUBLIC } from '@/constants/app.constant';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()]);
    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(IS_AUTH_OPTIONAL, [context.getHandler(), context.getClass()]);
    const isAdminRoute = this.reflector.getAllAndOverride<boolean>(IS_ADMIN, [context.getHandler(), context.getClass()]);
    const isAuthRoute = this.reflector.getAllAndOverride<boolean>(IS_AUTH, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (isPublic) return true;
    if (isAuthOptional && !accessToken) return true;
    if (!accessToken) throw new UnauthorizedException();

    const user = await this.authService.verifyAccessToken(accessToken);
    const userDbRecord = await this.userService.findOne(user.sub);
    if (!userDbRecord || userDbRecord.active_token !== accessToken) throw new UnauthorizedException();

    request['user'] = user;

    if (isAuthRoute) return true;
    if (!user.adminId) throw new UnauthorizedException();

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
