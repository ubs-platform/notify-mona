import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Roles, RolesGuard } from '@ubs-platform/users-mona-roles';
import { JwtAuthGuard } from '@ubs-platform/users-mona-microservice-helper';
import { BaseCrudService } from 'src/app/service/base/base-crud.service';

export const BaseCrudServiceClassGenerator = () => {
  class ControllerClass<MODEL, INPUT extends { id }, OUTPUT> {
    constructor(private service: BaseCrudService<MODEL, INPUT, OUTPUT>) {}

    @UseGuards()
    @Get()
    async fetchAll() {
      return await this.service.fetchAll();
    }

    @Get('/:id')
    async fetchOne(@Param() { id }: { id: any }) {
      return await this.service.fetchOne(id);
    }

    @Post()
    async add(@Body() body: INPUT) {
      return await this.service.create(body);
    }

    @Put('/:id')
    async edit(@Body() body: INPUT) {
      return await this.service.create(body);
    }
  }

  return ControllerClass;
};
