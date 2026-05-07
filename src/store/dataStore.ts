import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobRequest, CVSubmission, FormQuestion } from '../types';

interface DataState {
  jobRequests: JobRequest[];
  cvSubmissions: CVSubmission[];
  cvQuestions: FormQuestion[];
  jobQuestions: FormQuestion[];
  addJobRequest: (job: JobRequest) => void;
  addCVSubmission: (cv: CVSubmission) => void;
  updateCVQuestions: (questions: FormQuestion[]) => void;
  updateJobQuestions: (questions: FormQuestion[]) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      jobRequests: [],
      cvSubmissions: [],
      cvQuestions: [], // They will be populated with defaults if empty
      jobQuestions: [],
      addJobRequest: (job) => set((state) => ({ jobRequests: [...state.jobRequests, job] })),
      addCVSubmission: (cv) => set((state) => ({ cvSubmissions: [...state.cvSubmissions, cv] })),
      updateCVQuestions: (questions) => set({ cvQuestions: questions }),
      updateJobQuestions: (questions) => set({ jobQuestions: questions }),
    }),
    {
      name: 'job-portal-storage',
    }
  )
);
