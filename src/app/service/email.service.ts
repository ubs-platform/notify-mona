import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { publicDecrypt } from 'crypto';
import { GlobalVariableService } from './global-variable.service';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private variableService: GlobalVariableService
  ) {}

  public sendWithTemplate() {
    const template = Handlebars.compile('Handlebars <b>{{doesWhat}}</b>');

    this.mailerService.sendMail({
      to,
      subject,
    });
  }
}
