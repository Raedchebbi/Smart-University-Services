import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClasses, getClasse, getClasseEtudiants, createClasse, updateClasse, deleteClasse, addEtudiants } from '../api/classeApi';
import type { CreateClasseDTO, AddEtudiantsDTO } from '../types/classe';
import toast from 'react-hot-toast';

export function useClasses() {
  return useQuery({ queryKey: ['classes'], queryFn: getClasses, staleTime: 1000 * 60 * 2 });
}

export function useClasse(id: string | undefined) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => getClasse(id!),
    enabled: !!id,
  });
}

export function useClasseEtudiants(id: string | undefined) {
  return useQuery({
    queryKey: ['classes', id, 'etudiants'],
    queryFn: () => getClasseEtudiants(id!),
    enabled: !!id,
  });
}

export function useCreateClasse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClasseDTO) => createClasse(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classes'] }); toast.success('Classe created'); },
    onError: () => toast.error('Failed to create classe'),
  });
}

export function useUpdateClasse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClasseDTO> }) => updateClasse(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classes'] }); toast.success('Classe updated'); },
    onError: () => toast.error('Failed to update classe'),
  });
}

export function useDeleteClasse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClasse(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classes'] }); toast.success('Classe deleted'); },
    onError: () => toast.error('Failed to delete classe'),
  });
}

export function useAddEtudiants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddEtudiantsDTO }) => addEtudiants(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classes'] }); toast.success('Students added'); },
    onError: () => toast.error('Failed to add students'),
  });
}
