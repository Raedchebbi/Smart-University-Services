export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
