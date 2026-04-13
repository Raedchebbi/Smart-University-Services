import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { NiveauxService } from './niveaux.service';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('niveaux')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NiveauxController {
  constructor(private readonly niveauxService: NiveauxService) {}

  @Get()
  @Roles('STUDENT', 'TEACHER', 'ADMIN')
  findAll() {
    return this.niveauxService.findAll();
  }

  @Get(':id')
  @Roles('STUDENT', 'TEACHER', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.niveauxService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateNiveauDto) {
    return this.niveauxService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateNiveauDto) {
    return this.niveauxService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.niveauxService.remove(id);
  }
}
