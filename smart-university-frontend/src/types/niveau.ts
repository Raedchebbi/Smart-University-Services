export interface Niveau {
  _id: string;
  nom: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNiveauDTO {
  nom: string;
  code: string;
  description?: string;
}
