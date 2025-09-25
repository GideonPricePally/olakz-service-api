import { JwtClaims, UserPayload } from '@/common/types/common.type';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CompleteForgetPasswordRequestDto } from './dto/complete-forget-password-request.dto';
import { CompleteSignupRequestDto } from './dto/complete-signup-request.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { SignupRequestResponseDto } from './dto/signup-request-response.dto';
import { UserSignupRequestDto } from './dto/signup-request.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { UserSigninDto } from './dto/user-signin.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  // private readonly authHandler = toNodeHandler(auth);
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    statusCode: HttpStatus.OK,
    summary: 'signup request for a user',
    description: 'user signup request initiated successfully',
    type: SignupRequestResponseDto,
  })
  @Post('signup/request')
  async signup_request(@Req() req: Request, @Body() createUserDto: UserSignupRequestDto) {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    return this.authService.signup_request(ip, createUserDto);
  }

  @ApiPublic({ statusCode: HttpStatus.OK, description: 'user resend signup otp successfully', summary: 'resend signup otp' })
  @Get('resend/signup/request/otp/:prospect_id')
  resend_signup_request_otp(@Param('prospect_id') prospect_id: string) {
    return this.authService.resend_signup_request_otp(prospect_id);
  }

  @ApiPublic({
    statusCode: HttpStatus.CREATED,
    summary: 'complete signup request for a user',
    description: 'user signup request completed successfully',
  })
  @Post('signup/request/complete')
  complete_signup_request(@Body() complete_signup_request_dto: CompleteSignupRequestDto) {
    return this.authService.complete_signup_request(complete_signup_request_dto);
  }

  @ApiPublic({ statusCode: HttpStatus.OK, summary: 'signin a user', description: 'user signin successfully' })
  @Post('signin')
  signin(@Body() signinDto: UserSigninDto) {
    return this.authService.signin(signinDto);
  }

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'signout a user', description: 'user signout successfully' })
  @Delete('signout')
  user_signout(@Req() req: Express.Request) {
    const user = (req as any)?.user as UserPayload & JwtClaims;
    return this.authService.signout(user);
  }

  @ApiAuth({ statusCode: HttpStatus.NO_CONTENT, summary: 'delete a user', description: 'user deleted their account successfully' })
  @Delete('account')
  user_delete(@Req() req: Express.Request) {
    const user = (req as any)?.user as UserPayload & JwtClaims;
    return this.authService.delete_account(user);
  }

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'update profile for a user', description: 'user profile updated successfully' })
  @Patch('profile')
  update_profile(@Req() req: Express.Request, @Body() body: UpdateProfileDto) {
    const user = (req as any)?.user as UserPayload;
    return this.authService.update_profile(user, body);
  }

  @ApiPublic({ statusCode: HttpStatus.OK, summary: 'forget password request for a user', description: 'user forget password successfully' })
  @Patch('forget/password/request')
  forget_password_request(@Body() data: ForgetPasswordDto) {
    return this.authService.forget_password_request(data);
  }

  @ApiPublic({ statusCode: HttpStatus.OK, summary: 'resend forget password otp', description: 'user resend forget password otp successfully' })
  @Get('resend/forget/password/request/otp/:fpr_id')
  resend_fpr_otp(@Param('fpr_id') fpr_id: string) {
    return this.authService.resend_fpr_otp(fpr_id);
  }

  @ApiPublic({ statusCode: HttpStatus.OK, summary: 'complete forget password', description: 'user complete forget password successfully' })
  @Patch('forget/password/request/complete')
  complete_fpr(@Body() complete_fpr_dto: CompleteForgetPasswordRequestDto) {
    return this.authService.complete_fpr(complete_fpr_dto);
  }

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'refresh a user token', description: 'user token refreshed successfully' })
  @Get('refresh/:refreshToken')
  refreshToken(@Param('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // @All('*')
  // async handleAuthRoutes(@Req() req: Request, @Res() res: Response) {
  //   await this.authHandler(req, res);
  //   // Prevent Nest from continuing to other routes if response already sent
  //   if (!res.writableEnded) {
  //     throw new NotFoundException('not found');
  //   }
  // }
}
