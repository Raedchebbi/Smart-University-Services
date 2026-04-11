import axios from 'axios'

const BASE_URL = 'http://localhost:8084/grades'

export const getAllGrades  = ()        => axios.get(BASE_URL)
export const getGradeById = (id)      => axios.get(`${BASE_URL}/${id}`)
export const createGrade  = (grade)   => axios.post(BASE_URL, grade)
export const updateGrade  = (id, g)   => axios.put(`${BASE_URL}/${id}`, g)
export const deleteGrade  = (id)      => axios.delete(`${BASE_URL}/${id}`)

export const getAverage = () => axios.get(`${BASE_URL}/stats/average`)
export const getMax     = () => axios.get(`${BASE_URL}/stats/max`)
export const getMin     = () => axios.get(`${BASE_URL}/stats/min`)
export const getTotal   = () => axios.get(`${BASE_URL}/stats/count`)