import type { Niveau } from './niveau';

export interface Classe {
  _id: string;
  nom: string;
  niveauId: string | Niveau;
  capacite: number;
  anneeUniversitaire: string;
  etudiants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClasseDTO {
  nom: string;
  niveauId: string;
  capacite: number;
  anneeUniversitaire: string;
  etudiants?: string[];
}

export interface AddEtudiantsDTO {
  etudiantIds: string[];
}
