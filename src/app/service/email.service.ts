import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { publicDecrypt } from 'crypto';
import { GlobalVariableService } from './global-variable.service';
import { EmailTemplateService } from './email-template.service';
import { EmailDto } from '../dto/email.dto';
import * as Handlebars from 'handlebars';
@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private globalVariableService: GlobalVariableService,
    private templateService: EmailTemplateService
  ) {}

  public async sendWithTemplate(em: EmailDto) {
    const templates = await this.templateService.fetchAll({
      nameContains: em.templateName,
    });
    if (templates.length > 0) {
      const temp = templates[0];
      const expandedGlobals =
        await this.globalVariableService.globalVariableApply({
          text: temp.htmlContent,
          language: em.language,
        });
      const applyTemplate = Handlebars.compile(expandedGlobals);
      const txt = applyTemplate(em.specialVariables);
      console.info(txt);
      await this.mailerService.sendMail({
        html: txt,
        subject: em.subject,
        to: em.to,
      });
    } else {
    }
  }
}
