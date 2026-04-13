import api from './axiosInstance';
import type { Reclamation, CreateReclamationDTO } from '../types/reclamation';

export const getReclamations = () =>
  api.get<Reclamation[]>('/api/reclamations').then((r) => r.data);

export const getStudentReclamations = (username: string) =>
  api.get<Reclamation[]>(`/api/reclamations/student/${username}`).then((r) => r.data);

export const createReclamation = (data: CreateReclamationDTO) =>
  api.post<Reclamation>('/api/reclamations', data).then((r) => r.data);
