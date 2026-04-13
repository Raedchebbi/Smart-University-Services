import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classe, ClasseDocument } from './schemas/classe.schema';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Classe.name) private readonly classeModel: Model<ClasseDocument>,
  ) {}

  async create(dto: CreateClasseDto): Promise<ClasseDocument> {
    return this.classeModel.create({
      ...dto,
      niveauId: new Types.ObjectId(dto.niveauId),
      etudiants: dto.etudiants ?? [],
    });
  }

  async findAll(): Promise<ClasseDocument[]> {
    return this.classeModel.find().populate('niveauId').exec();
  }

  async findOne(id: string): Promise<ClasseDocument> {
    const classe = await this.classeModel.findById(id).populate('niveauId').exec();
    if (!classe) throw new NotFoundException(`Classe ${id} not found`);
    return classe;
  }

  async update(id: string, dto: UpdateClasseDto): Promise<ClasseDocument> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.niveauId) updateData['niveauId'] = new Types.ObjectId(dto.niveauId);
    if (dto.etudiants) updateData['etudiants'] = dto.etudiants;

    const classe = await this.classeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!classe) throw new NotFoundException(`Classe ${id} not found`);
    return classe;
  }

  async remove(id: string): Promise<void> {
    const result = await this.classeModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Classe ${id} not found`);
  }

  async getEtudiants(id: string): Promise<string[]> {
    const classe = await this.classeModel.findById(id).exec();
    if (!classe) throw new NotFoundException(`Classe ${id} not found`);
    return classe.etudiants;
  }

  async addEtudiants(id: string, etudiantIds: string[]): Promise<ClasseDocument> {
    const classe = await this.classeModel.findById(id).exec();
    if (!classe) throw new NotFoundException(`Classe ${id} not found`);

    const uniqueNew = etudiantIds.filter((eid) => !classe.etudiants.includes(eid));
    classe.etudiants.push(...uniqueNew);
    return classe.save();
  }
}
