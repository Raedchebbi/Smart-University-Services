import { IsOptional, IsString, IsNumber, IsMongoId, IsArray } from 'class-validator';

export class UpdateClasseDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsMongoId()
  @IsOptional()
  niveauId?: string;

  @IsNumber()
  @IsOptional()
  capacite?: number;

  @IsString()
  @IsOptional()
  anneeUniversitaire?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  etudiants?: string[];
}
