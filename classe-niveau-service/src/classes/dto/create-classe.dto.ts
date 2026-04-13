import { IsNotEmpty, IsString, IsNumber, IsMongoId, IsOptional, IsArray } from 'class-validator';

export class CreateClasseDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsMongoId()
  @IsNotEmpty()
  niveauId!: string;

  @IsNumber()
  @IsNotEmpty()
  capacite!: number;

  @IsString()
  @IsNotEmpty()
  anneeUniversitaire!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  etudiants?: string[];
}
