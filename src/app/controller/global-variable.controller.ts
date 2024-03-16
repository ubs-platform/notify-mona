import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@ubs-platform/users-mona-microservice-helper';
import { Roles, RolesGuard } from '@ubs-platform/users-mona-roles';
import { GlobalVariableService } from '../service/global-variable.service';
import { GlobalVariableWriteDTO } from '../dto/global-variable.dto';

@Controller('global-variable')
export class GlobalVariableController {
  constructor(public s: GlobalVariableService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async fetchAll() {
    return await this.s.fetchAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async edit(@Body() body: GlobalVariableWriteDTO) {
    return await this.s.editOne(body);
  }

  @Get('language/:langauge/name/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async search(@Param() searchobj: GlobalVariableWriteDTO) {
    return await this.s.search(searchobj);
  }
}
