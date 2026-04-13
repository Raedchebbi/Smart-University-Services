import { IsOptional, IsString } from 'class-validator';

export class UpdateNiveauDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
