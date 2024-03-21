import { Body, Controller, Post } from '@nestjs/common';
import { GlobalVariableService } from '../service/global-variable.service';
import { EmailService } from '../service/email.service';
import { EmailDto } from '../dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(public s: EmailService) {}

  @Post()
  public async sendEmail(@Body() mail: EmailDto) {
    await this.s.sendWithTemplate(mail);
  }
}
