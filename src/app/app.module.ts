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
import { MailerModule } from '@nestjs-modules/mailer';
import Handlebars from 'handlebars';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailController } from './controller/email-operation.controller';
import { EmailService } from './service/email.service';
import nodemailer from 'nodemailer';

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
    MailerModule.forRoot({
      transport: nodemailer.createTransport({
        host: process.env.UNOTIFY_MAIL_SERVER_HOST,
        port: process.env.UNOTIFY_MAIL_SERVER_PORT,
        secure: true, // use TLS
        auth:
          process.env.UNOTIFY_MAIL_SERVER_UNAME ||
          process.env.UNOTIFY_MAIL_SERVER_PW
            ? {
                user: process.env.UNOTIFY_MAIL_SERVER_UNAME,
                pass: process.env.UNOTIFY_MAIL_SERVER_PW,
              }
            : null,
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: !(
            process.env.UNOTIFY_MAIL_CERT_IGNORE_SSL &&
            process.env.UNOTIFY_MAIL_CERT_IGNORE_SSL != 'false'
          ),
        },
      }),
      defaults: {
        from: process.env.UNOTIFY_MAIL_FROM,
      },
      // template: {
      //   dir: __dirname + '/templates',
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  controllers: [
    EmailTemplateController,
    GlobalVariableController,
    EmailController,
  ],
  providers: [EmailTemplateService, GlobalVariableService, EmailService],
})
export class AppModule {}
