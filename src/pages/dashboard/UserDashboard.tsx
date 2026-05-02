import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { Navigate, Link } from 'react-router';
import { Button } from '../../components/ui/Button';
import { Clock, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function UserDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { jobRequests, cvSubmissions } = useDataStore();

  if (!user || user.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  const isCandidate = user.role === 'candidate';
  
  const myCVs = cvSubmissions.filter(c => c.candidate_id === user.id);
  const myJobs = jobRequests.filter(j => j.employer_id === user.id);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('profile_title')}</h1>
          <p className="text-gray-500">{t('profile_desc')}</p>
        </div>
        {isCandidate ? (
           <Link to="/submit-cv">
             <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">{t('update_cv')}</Button>
           </Link>
        ) : (
           <Link to="/post-job">
             <Button className="rounded-full bg-amber-600 hover:bg-amber-700 text-white gap-2"><PlusCircle className="w-4 h-4" /> {t('post_new_job')}</Button>
           </Link>
        )}
      </div>

      <div className="grid gap-6">
        {isCandidate && myCVs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm border-dashed">
            <p className="text-gray-500 mb-4">{t('no_cv')}</p>
            <Link to="/submit-cv">
              <Button >{t('get_started')}</Button>
            </Link>
          </div>
        )}

        {isCandidate && myCVs.map(cv => (
          <motion.div key={cv.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl uppercase">{t('cv')}</div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg">{t('my_profile_file')}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(cv.submitted_at).toLocaleDateString()}</p>
                 </div>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                {cv.status}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 grid md:grid-cols-2 gap-6">
               {cv.responses.map((r, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-500 mb-1">{r.question}</p>
                    <p className="text-gray-900 font-medium">
                      {Array.isArray(r.answer) ? r.answer.join(', ') : r.answer?.toString() || '—'}
                    </p>
                  </div>
               ))}
            </div>
          </motion.div>
        ))}


        {!isCandidate && myJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm border-dashed">
            <p className="text-gray-500 mb-4">{t('no_job')}</p>
            <Link to="/post-job">
              <Button >{t('create_job_req')}</Button>
            </Link>
          </div>
        )}

        {!isCandidate && myJobs.map(job => (
          <motion.div key={job.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-6 border-b border-gray-100 gap-4">
              <div className="flex items-center gap-3">
                 <div>
                    <h3 className="font-bold text-gray-900 text-xl">{job.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> {new Date(job.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${job.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                {job.status}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                 <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{t('location')}</p>
                 <p className="text-gray-900 font-medium">{job.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                 <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{t('salary')}</p>
                 <p className="text-gray-900 font-medium">{job.salary_min} - {job.salary_max} IQD</p>
              </div>
               <div className="bg-gray-50 p-4 rounded-xl col-span-full">
                 <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">{t('description')}</p>
                 <p className="text-gray-900">{job.description}</p>
              </div>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
