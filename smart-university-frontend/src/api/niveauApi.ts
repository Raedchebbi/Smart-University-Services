import api from './axiosInstance';
import type { Niveau, CreateNiveauDTO } from '../types/niveau';

export const getNiveaux = () =>
  api.get<Niveau[]>('/api/niveaux').then((r) => r.data);

export const getNiveau = (id: string) =>
  api.get<Niveau>(`/api/niveaux/${id}`).then((r) => r.data);

export const createNiveau = (data: CreateNiveauDTO) =>
  api.post<Niveau>('/api/niveaux', data).then((r) => r.data);

export const updateNiveau = (id: string, data: Partial<CreateNiveauDTO>) =>
  api.patch<Niveau>(`/api/niveaux/${id}`, data).then((r) => r.data);

export const deleteNiveau = (id: string) =>
  api.delete(`/api/niveaux/${id}`);
