import api from './axiosInstance';
import type { CourseResponseDTO, CreateCourseDTO } from '../types/course';
import type { EnrollmentResponseDTO, CreateEnrollmentDTO } from '../types/enrollment';

// ── Courses ──
export const getCourses = () =>
  api.get<CourseResponseDTO[]>('/api/academic/courses').then((r) => r.data);

export const getCourse = (id: number) =>
  api.get<CourseResponseDTO>(`/api/academic/courses/${id}`).then((r) => r.data);

export const createCourse = (data: CreateCourseDTO) =>
  api.post<CourseResponseDTO>('/api/academic/courses', data).then((r) => r.data);

export const updateCourse = (id: number, data: CreateCourseDTO) =>
  api.put<CourseResponseDTO>(`/api/academic/courses/${id}`, data).then((r) => r.data);

export const deleteCourse = (id: number) =>
  api.delete(`/api/academic/courses/${id}`);

// ── Enrollments ──
export const getEnrollments = () =>
  api.get<EnrollmentResponseDTO[]>('/api/academic/enrollments').then((r) => r.data);

export const getEnrollmentsByStudent = (studentId: number) =>
  api.get<EnrollmentResponseDTO[]>(`/api/academic/enrollments/student/${studentId}`).then((r) => r.data);

export const getEnrollmentsByCourse = (courseId: number) =>
  api.get<EnrollmentResponseDTO[]>(`/api/academic/enrollments/course/${courseId}`).then((r) => r.data);

export const createEnrollment = (data: CreateEnrollmentDTO) =>
  api.post<EnrollmentResponseDTO>('/api/academic/enrollments', data).then((r) => r.data);

export const cancelEnrollment = (id: number) =>
  api.put<EnrollmentResponseDTO>(`/api/academic/enrollments/${id}/cancel`).then((r) => r.data);
