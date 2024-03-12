import { Injectable } from '@nestjs/common';
import { EmailTemplate } from '../model/email-template.model';
import { EmailTemplateDTO } from '../dto/email-template.dto';
import { BaseCrudServiceGenerate } from './base/base-crud.service';
import { EmailTemplateSearch } from '../dto/email-template.search';

@Injectable()
export class EmailTemplateService extends BaseCrudServiceGenerate<
  EmailTemplate,
  EmailTemplateDTO,
  EmailTemplateDTO,
  EmailTemplateSearch
>(EmailTemplate.name) {
  searchParams(s: EmailTemplateSearch): { [key: string]: any } {
    const searchQueries: { [key: string]: any } = {};
    if (s?.htmlContentContains != null) {
      searchQueries.htmlContent = {};
    }
    return searchQueries;
  }
  toOutput(m: EmailTemplate): EmailTemplateDTO | Promise<EmailTemplateDTO> {
    return { htmlContent: m.htmlContent, _id: m._id };
  }
  moveIntoModel(
    model: EmailTemplate,
    i: EmailTemplateDTO
  ): EmailTemplate | Promise<EmailTemplate> {
    model.htmlContent = i.htmlContent;
    return model;
  }
}
