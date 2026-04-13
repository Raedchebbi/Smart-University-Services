import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NiveauDocument = HydratedDocument<Niveau>;

@Schema({ timestamps: true })
export class Niveau {
  @Prop({ required: true })
  nom!: string;

  @Prop({ required: true, unique: true })
  code!: string;

  @Prop()
  description!: string;
}

export const NiveauSchema = SchemaFactory.createForClass(Niveau);

// Unique index on code
NiveauSchema.index({ code: 1 }, { unique: true });
