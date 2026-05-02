import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router';
import { FileText, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { jobRequests, cvSubmissions } = useDataStore();
  const [tab, setTab] = useState<'cv' | 'job'>('cv');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('admin_panel')}</h1>
          <p className="text-gray-500">{t('admin_desc')}</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-xl self-start">
          <button
            onClick={() => setTab('cv')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'cv' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <FileText className="w-4 h-4" /> {t('cv_submissions')} ({cvSubmissions.length})
          </button>
          <button
            onClick={() => setTab('job')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'job' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Building2 className="w-4 h-4" /> {t('job_requests')} ({jobRequests.length})
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {tab === 'cv' && (
          <div className="space-y-6">
            {cvSubmissions.length === 0 && <p className="text-gray-500">{t('no_cv_admin')}</p>}
            {cvSubmissions.map((cv, idx) => (
              <motion.div key={cv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <h3 className="font-bold tracking-tight text-gray-900 text-lg">
                      {cv.candidate_name ? `${t('cv')}: ${cv.candidate_name}` : `Submission ID: ${cv.id}`}
                    </h3>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {cv.candidate_email && <span className="font-medium text-emerald-600">{cv.candidate_email}</span>}
                      {cv.candidate_phone && <span className="font-medium text-gray-600">{cv.candidate_phone}</span>}
                      {cv.target_job && <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md text-xs">{cv.target_job}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(cv.submitted_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${cv.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {cv.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cv.responses.map((r, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-emerald-600 mb-1 uppercase tracking-wider">{r.question}</p>
                      <p className="text-gray-900 font-medium">
                        {Array.isArray(r.answer) ? r.answer.join(', ') : r.answer?.toString() || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'job' && (
          <div className="space-y-6">
            {jobRequests.length === 0 && <p className="text-gray-500">{t('no_job_admin')}</p>}
            {jobRequests.map((job, idx) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <h3 className="font-bold tracking-tight text-gray-900 text-xl">{job.title}</h3>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {job.employer_name && <span className="font-medium text-amber-600">{t('company')}: {job.employer_name}</span>}
                      {job.employer_email && <span className="text-gray-500">{job.employer_email}</span>}
                      {job.employer_phone && <span className="font-medium text-gray-600">{job.employer_phone}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(job.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {job.status}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('location')}</p>
                      <p className="text-gray-900 font-medium">{job.location}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('job_type')}</p>
                      <p className="text-gray-900 font-medium">{job.job_type || '—'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('exp_req')}</p>
                      <p className="text-gray-900 font-medium">{job.experience_required ? `${job.experience_required} years` : '—'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('edu_req')}</p>
                      <p className="text-gray-900 font-medium">{job.education_required || '—'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('salary')}</p>
                    <p className="text-gray-900 font-medium">{job.salary_min} - {job.salary_max}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                     <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('description')}</p>
                     <p className="text-gray-900 whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
