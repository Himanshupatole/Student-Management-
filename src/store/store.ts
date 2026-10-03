import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import type { Student } from '../types/Student';

const loadStudents = (): Student[] => {
  try {
    const savedStudents = localStorage.getItem('student-management-students');
    const parsedStudents: unknown = savedStudents ? JSON.parse(savedStudents) : [];
    return Array.isArray(parsedStudents) ? parsedStudents as Student[] : [];
  } catch {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    students: studentReducer,
  },
  preloadedState: {
    students: { students: loadStudents() },
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem('student-management-students', JSON.stringify(store.getState().students.students));
  } catch {
    // Keep the app usable if browser storage is unavailable.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
