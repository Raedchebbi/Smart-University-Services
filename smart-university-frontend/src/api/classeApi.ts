import api from './axiosInstance';
import type { Classe, CreateClasseDTO, AddEtudiantsDTO } from '../types/classe';

export const getClasses = () =>
  api.get<Classe[]>('/api/classes').then((r) => r.data);

export const getClasse = (id: string) =>
  api.get<Classe>(`/api/classes/${id}`).then((r) => r.data);

export const getClasseEtudiants = (id: string) =>
  api.get<string[]>(`/api/classes/${id}/etudiants`).then((r) => r.data);

export const createClasse = (data: CreateClasseDTO) =>
  api.post<Classe>('/api/classes', data).then((r) => r.data);

export const updateClasse = (id: string, data: Partial<CreateClasseDTO>) =>
  api.patch<Classe>(`/api/classes/${id}`, data).then((r) => r.data);

export const deleteClasse = (id: string) =>
  api.delete(`/api/classes/${id}`);

export const addEtudiants = (id: string, data: AddEtudiantsDTO) =>
  api.post<Classe>(`/api/classes/${id}/etudiants`, data).then((r) => r.data);
