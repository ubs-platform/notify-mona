import { Body, Controller, Post } from '@nestjs/common';
import { GlobalVariableService } from '../service/global-variable.service';
import { EmailService } from '../service/email.service';
import { EmailDto } from '../dto/email.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('email')
export class EmailController {
  constructor(public s: EmailService) {}

  @Post()
  public async sendEmail(@Body() mail: EmailDto) {
    await this.s.sendWithTemplate(mail);
  }

  @MessagePattern('email-reset')
  public async sendMailBg(@Payload() mail: EmailDto) {
    console.info(mail);
    await this.s.sendWithTemplate(mail);
  }
}
