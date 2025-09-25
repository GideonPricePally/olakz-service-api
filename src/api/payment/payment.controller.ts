import { UserPayload } from '@/common/types/common.type';
import { AuthUser } from '@/decorators/auth.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Session } from '@/decorators/session.decorator';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResolveAccountNumber } from './dto/resolve-account-number.dto';
import { PaymentVerificationDto } from './dto/verify-payment';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'get user bank list by country', description: 'get user bank list by country' })
  @Get('banks')
  @AuthUser()
  banks(@Session() session: UserPayload) {
    return this.paymentService.banks(session.countryId);
  }

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'get payment providers bank list by country', description: 'get user bank list by country' })
  @Get('providers')
  @AuthUser()
  paymentProviders(@Session() session: UserPayload) {
    return this.paymentService.paymentProviders(session.countryId);
  }

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'get user bank list by country', description: 'get user bank list by country' })
  @Get('banks/resolve')
  @AuthUser()
  verifyAccountNumber(@Session() session: UserPayload, @Query() query: ResolveAccountNumber) {
    return this.paymentService.verifyAccountNumber(session, query);
  }

  @ApiAuth({ statusCode: HttpStatus.OK, summary: 'get user bank list by country', description: 'get user bank list by country' })
  @Get('reference')
  verifyPayment(@Session() session: UserPayload, @Query() { reference }: PaymentVerificationDto) {
    return this.paymentService.verifyPayment(session, reference);
  }
}
