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
import {
  GlobalVariableDTO,
  GlobalVariableRenameDTO,
  GlobalVariableWriteDTO,
} from '@ubs-platform/notify-common';

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

  @Put('rename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async renameTo(@Body() body: GlobalVariableRenameDTO) {
    return await this.s.rename(body);
  }

  @Put('dublicate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async dublicate(@Body() { id }: { id: any }) {
    return await this.s.dublicate(id);
  }

  // @Put()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(['ADMIN'])
  // async edit(@Body() body: GlobalVariableDTO[]) {
  //   return await this.s.editAll(body);
  // }
}
