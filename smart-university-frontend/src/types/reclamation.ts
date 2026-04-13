export type ReclamationStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface Reclamation {
  id: number;
  studentName: string;
  subject: string;
  description: string;
  type: string;
  status: ReclamationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReclamationDTO {
  studentName: string;
  subject: string;
  description: string;
  type: string;
  status?: string;
}
