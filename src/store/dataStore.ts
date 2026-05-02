import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobRequest, CVSubmission } from '../types';

interface DataState {
  jobRequests: JobRequest[];
  cvSubmissions: CVSubmission[];
  addJobRequest: (job: JobRequest) => void;
  addCVSubmission: (cv: CVSubmission) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      jobRequests: [],
      cvSubmissions: [],
      addJobRequest: (job) => set((state) => ({ jobRequests: [...state.jobRequests, job] })),
      addCVSubmission: (cv) => set((state) => ({ cvSubmissions: [...state.cvSubmissions, cv] })),
    }),
    {
      name: 'job-portal-storage',
    }
  )
);
