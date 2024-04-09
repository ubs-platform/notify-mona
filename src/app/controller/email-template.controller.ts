import { Controller } from '@nestjs/common';
import { BaseCrudControllerGenerator } from './base/base-crud.controller';
import { EmailTemplate } from '../model/email-template.model';
import { EmailTemplateService } from '../service/email-template.service';
import {
  EmailTemplateDTO,
  EmailTemplateSearch,
} from '@ubs-platform/notify-common';

const config = {
  authorization: { ALL: { needsAuthenticated: true, roles: ['ADMIN'] } },
};
@Controller('email-template')
export class EmailTemplateController extends BaseCrudControllerGenerator<
  EmailTemplate,
  EmailTemplateDTO,
  EmailTemplateDTO,
  EmailTemplateSearch
>(config) {
  constructor(service: EmailTemplateService) {
    super(service);
  }
}
