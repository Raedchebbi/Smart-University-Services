export interface CourseResponseDTO {
  id: number;
  title: string;
  description: string | null;
  credits: number;
  professorId: number | null;
  createdAt: string;
}

export interface CreateCourseDTO {
  title: string;
  description?: string;
  credits: number;
  professorId?: number;
}
