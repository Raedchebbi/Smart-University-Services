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
import { ClassesService } from './classes.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { AddEtudiantsDto } from './dto/add-etudiants.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @Roles('STUDENT', 'TEACHER', 'ADMIN')
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @Roles('STUDENT', 'TEACHER', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Get(':id/etudiants')
  @Roles('TEACHER', 'ADMIN')
  getEtudiants(@Param('id') id: string) {
    return this.classesService.getEtudiants(id);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClasseDto) {
    return this.classesService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateClasseDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  @Post(':id/etudiants')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  addEtudiants(@Param('id') id: string, @Body() dto: AddEtudiantsDto) {
    return this.classesService.addEtudiants(id, dto.etudiantIds);
  }
}
