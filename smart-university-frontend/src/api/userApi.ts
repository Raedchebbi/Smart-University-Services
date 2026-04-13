import api from './axiosInstance';
import type { User, CreateUserDTO, UserRole } from '../types/user';

export const getMe = () =>
  api.get<string>('/api/users/me').then((r) => r.data);

export const getUsers = () =>
  api.get<User[]>('/api/users').then((r) => r.data);

export const getUser = (id: number) =>
  api.get<User>(`/api/users/${id}`).then((r) => r.data);

export const getUserByEmail = (email: string) =>
  api.get<User>(`/api/users/email/${email}`).then((r) => r.data);

export const getUsersByRole = (role: UserRole) =>
  api.get<User[]>(`/api/users/role/${role}`).then((r) => r.data);

export const createUser = (data: CreateUserDTO) =>
  api.post<User>('/api/users', data).then((r) => r.data);

export const updateUser = (id: number, data: CreateUserDTO) =>
  api.put<User>(`/api/users/${id}`, data).then((r) => r.data);

export const deleteUser = (id: number) =>
  api.delete(`/api/users/${id}`);
