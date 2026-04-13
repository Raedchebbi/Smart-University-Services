import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Niveau, NiveauDocument } from './schemas/niveau.schema';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';

@Injectable()
export class NiveauxService {
  constructor(
    @InjectModel(Niveau.name) private readonly niveauModel: Model<NiveauDocument>,
  ) {}

  async create(dto: CreateNiveauDto): Promise<NiveauDocument> {
    return this.niveauModel.create(dto);
  }

  async findAll(): Promise<NiveauDocument[]> {
    return this.niveauModel.find().exec();
  }

  async findOne(id: string): Promise<NiveauDocument> {
    const niveau = await this.niveauModel.findById(id).exec();
    if (!niveau) throw new NotFoundException(`Niveau ${id} not found`);
    return niveau;
  }

  async update(id: string, dto: UpdateNiveauDto): Promise<NiveauDocument> {
    const niveau = await this.niveauModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!niveau) throw new NotFoundException(`Niveau ${id} not found`);
    return niveau;
  }

  async remove(id: string): Promise<void> {
    const result = await this.niveauModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Niveau ${id} not found`);
  }
}
