import { Module } from '@nestjs/common';

import { BackendJwtUtilsModule } from '@ubs-platform/users-mona-microservice-helper';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from './model/email-template.model';
import { EmailTemplateController } from './controller/email-template.controller';
import { EmailTemplateService } from './service/email-template.service';
import {
  GlobalVariable,
  GlobalVariableSchema,
} from './model/global-variable.model';
import { GlobalVariableService } from './service/global-variable.service';
import { GlobalVariableController } from './controller/global-variable.controller';

@Module({
  imports: [
    BackendJwtUtilsModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.NX_MONGO_USERNAME}:${
        process.env.NX_MONGO_PASSWORD
      }@${process.env.NX_MONGO_URL || 'localhost'}/?authMechanism=DEFAULT`,
      {
        dbName: process.env.NX_MONGO_DBNAME || 'ubs_users',
      }
    ),
    MongooseModule.forFeature([
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
      { name: GlobalVariable.name, schema: GlobalVariableSchema },
    ]),
  ],
  controllers: [EmailTemplateController, GlobalVariableController],
  providers: [EmailTemplateService, GlobalVariableService],
})
export class AppModule {}
