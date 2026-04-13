import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNiveauDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
