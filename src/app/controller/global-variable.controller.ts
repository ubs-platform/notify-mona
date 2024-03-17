import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@ubs-platform/users-mona-microservice-helper';
import { Roles, RolesGuard } from '@ubs-platform/users-mona-roles';
import { GlobalVariableService } from '../service/global-variable.service';
import { GlobalVariableWriteDTO } from '../dto/global-variable-write.dto';
import { VariableExpansion } from '../dto/expansion-input.dto';

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

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async apply(@Body() body: VariableExpansion) {
    return await this.s.apply(body);
  }
}
