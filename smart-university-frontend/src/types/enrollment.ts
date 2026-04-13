export type EnrollmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface EnrollmentResponseDTO {
  id: number;
  studentId: number;
  courseId: number;
  courseTitle: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
}

export interface CreateEnrollmentDTO {
  studentId: number;
  courseId: number;
}
