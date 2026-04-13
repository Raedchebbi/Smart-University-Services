export interface Grade {
  id: number;
  studentName: string;
  subject: string;
  examType: string;
  semester: string;
  score: number;
  createdAt: string;
}

export interface CreateGradeDTO {
  studentName: string;
  subject: string;
  examType: string;
  semester: string;
  score: number;
}
