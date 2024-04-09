import { Injectable } from '@nestjs/common';
import { EmailTemplate } from '../model/email-template.model';
import { BaseCrudServiceGenerate } from './base/base-crud.service';
import { FilterQuery } from 'mongoose';
import {
  EmailTemplateDTO,
  EmailTemplateSearch,
} from '@ubs-platform/notify-common';

@Injectable()
export class EmailTemplateService extends BaseCrudServiceGenerate<
  EmailTemplate,
  EmailTemplateDTO,
  EmailTemplateDTO,
  EmailTemplateSearch
>(EmailTemplate.name) {
  searchParams(s: EmailTemplateSearch): FilterQuery<EmailTemplate> {
    const searchQueries: FilterQuery<EmailTemplate> = {};
    if (s) {
      if (s.htmlContentContains != null) {
        searchQueries.htmlContent = {
          // like search
          $regex: '.*' + s.htmlContentContains + '.*',
        };
      }

      if (s.nameContains != null) {
        searchQueries.name = {
          // like search
          $regex: '.*' + s.nameContains + '.*',
        };
      }
    }

    return searchQueries;
  }

  toOutput(m?: EmailTemplate): EmailTemplateDTO | Promise<EmailTemplateDTO> {
    return {
      htmlContent: m.htmlContent as string,
      name: m.name?.toString(),
      _id: m._id as string,
    };
  }

  moveIntoModel(
    model: EmailTemplate,
    i: EmailTemplateDTO
  ): EmailTemplate | Promise<EmailTemplate> {
    model.htmlContent = i.htmlContent;
    model.name = i.name;
    return model;
  }
}
