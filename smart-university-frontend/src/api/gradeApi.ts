import api from './axiosInstance';
import type { Grade, CreateGradeDTO } from '../types/grade';

export const getGrades = () =>
  api.get<Grade[]>('/api/grades').then((r) => r.data);

export const getStudentGrades = (studentName: string) =>
  api.get<Grade[]>('/api/grades').then((r) =>
    r.data.filter((g) => g.studentName === studentName)
  );

export const createGrade = (data: CreateGradeDTO) =>
  api.post<Grade>('/api/grades', data).then((r) => r.data);

export const updateGrade = (id: number, data: CreateGradeDTO) =>
  api.put<Grade>(`/api/grades/${id}`, data).then((r) => r.data);

export const getGradeAverage = () =>
  api.get<number>('/api/grades/stats/average').then((r) => r.data);

export const getGradeMax = () =>
  api.get<number>('/api/grades/stats/max').then((r) => r.data);

export const getGradeMin = () =>
  api.get<number>('/api/grades/stats/min').then((r) => r.data);

export const getGradeCount = () =>
  api.get<number>('/api/grades/stats/count').then((r) => r.data);
