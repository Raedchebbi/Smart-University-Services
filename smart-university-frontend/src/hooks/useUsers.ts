import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, getUsersByRole } from '../api/userApi';
import type { CreateUserDTO, UserRole } from '../types/user';
import toast from 'react-hot-toast';

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers });
}

export function useUsersByRole(role: UserRole) {
  return useQuery({ queryKey: ['users', 'role', role], queryFn: () => getUsersByRole(role) });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDTO) => createUser(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User created'); },
    onError: () => toast.error('Failed to create user'),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUserDTO }) => updateUser(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User updated'); },
    onError: () => toast.error('Failed to update user'),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted'); },
    onError: () => toast.error('Failed to delete user'),
  });
}
