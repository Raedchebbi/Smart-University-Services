import { IsArray, IsString } from 'class-validator';

export class AddEtudiantsDto {
  @IsArray()
  @IsString({ each: true })
  etudiantIds!: string[];
}
