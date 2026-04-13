import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Niveau } from '../../niveaux/schemas/niveau.schema';

export type ClasseDocument = HydratedDocument<Classe>;

@Schema({ timestamps: true })
export class Classe {
  @Prop({ required: true })
  nom!: string;

  @Prop({ type: Types.ObjectId, ref: Niveau.name, required: true })
  niveauId!: Types.ObjectId;

  @Prop({ required: true })
  capacite!: number;

  @Prop({ required: true })
  anneeUniversitaire!: string;

  // Keycloak usernames of students
  @Prop({ type: [String], default: [] })
  etudiants!: string[];
}

export const ClasseSchema = SchemaFactory.createForClass(Classe);

// Compound index on (niveauId + anneeUniversitaire)
ClasseSchema.index({ niveauId: 1, anneeUniversitaire: 1 });
