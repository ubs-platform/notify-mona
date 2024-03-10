import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Roles, RolesGuard } from '@ubs-platform/users-mona-roles';
import { JwtAuthGuard } from '@ubs-platform/users-mona-microservice-helper';
import { IBaseCrudService } from 'src/app/service/base/base-crud.service';

export const BaseCrudControllerGenerator = <
  MODEL,
  INPUT extends { _id },
  OUTPUT
>() => {
  class ControllerClass {
    constructor(private service: IBaseCrudService<MODEL, INPUT, OUTPUT>) {}

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

    @Put()
    async edit(@Body() body: INPUT) {
      if (body._id == null) {
        throw new NotFoundException();
      }
      return await this.service.edit(body);
    }

    @Delete(':id')
    async remove(@Param() { id }: { id: any }) {}
  }

  return ControllerClass;
};
