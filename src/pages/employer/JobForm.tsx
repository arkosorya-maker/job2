import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { InlineAuth } from '../../components/auth/InlineAuth';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function JobForm() {
  const navigate = useNavigate();
  const { addJobRequest } = useDataStore();
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ckb';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    job_type: '',
    location: '',
    description: '',
    experience_required: '',
    education_required: '',
    salary_min: '',
    salary_max: '',
    employer_phone: '',
  });

  const submitFinal = () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    addJobRequest({
      id: `job-${Date.now()}`,
      employer_id: currentUser.id,
      employer_name: currentUser.name,
      employer_email: currentUser.email,
      employer_phone: formData.employer_phone || currentUser.phone,
      title: formData.title,
      job_type: formData.job_type,
      description: formData.description,
      location: formData.location,
      experience_required: formData.experience_required,
      education_required: formData.education_required,
      salary_min: parseInt(formData.salary_min) || 0,
      salary_max: parseInt(formData.salary_max) || 0,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    setIsSubmitted(true);
  };

  React.useEffect(() => {
    if (currentStep === 2 && user && !isSubmitted) {
       submitFinal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, user]);


  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 mt-12"
      >
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('job_success_title')}</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
          {t('job_success_desc')}
        </p>
        <Button size="lg" className="rounded-full bg-gray-900 hover:bg-gray-800 text-white" onClick={() => navigate('/dashboard')}>
          {t('go_dashboard')}
        </Button>
      </motion.div>
    );
  }

  if (currentStep === 2 && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center py-12">
        <InlineAuth role="employer" onComplete={submitFinal} />
      </div>
    );
  }

  if (currentStep === 2 && user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('post_job_title')}</h1>
        <p className="text-gray-500 mt-2">{t('post_job_desc')}</p>
        
        <div className="flex gap-2 mt-8">
          {[t('job_role'), t('details'), t('submit')].map((title, i) => (
            <div key={i} className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${i <= currentStep ? 'bg-amber-500' : ''}`}
                initial={{ width: 0 }}
                animate={{ width: i <= currentStep ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={currentStep}
           initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0 }}
           className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl"
        >
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('job_title')}</label>
                <Input 
                  required 
                  className="h-14 text-lg bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

               <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('job_type')}</label>
                <select 
                  className="w-full h-14 px-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-amber-500 text-gray-900"
                  value={formData.job_type} 
                  onChange={e => setFormData({...formData, job_type: e.target.value})}
                >
                  <option value="" disabled>-</option>
                  {t('job_type_opts').split(',').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

               <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('job_location')}</label>
                <Input 
                  required 
                  className="h-14 text-lg bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
               <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('phone')} ({t('employer')})</label>
                <Input 
                  type="tel"
                  className="h-14 text-lg bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                  value={formData.employer_phone} 
                  onChange={e => setFormData({...formData, employer_phone: e.target.value})}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
               <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t('detailed_desc')}</label>
                <textarea 
                  required 
                  className="w-full h-40 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 resize-none text-gray-900"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                 <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('exp_req')}</label>
                  <Input 
                    type="number"
                    className="h-14 text-lg bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                    value={formData.experience_required} 
                    onChange={e => setFormData({...formData, experience_required: e.target.value})}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('edu_req')}</label>
                  <select 
                    className="w-full h-14 px-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-amber-500 text-gray-900"
                    value={formData.education_required} 
                    onChange={e => setFormData({...formData, education_required: e.target.value})}
                  >
                    <option value="" disabled>-</option>
                    {t('edu_req_opts').split(',').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('min_salary')}</label>
                  <Input 
                    type="number"
                    className="h-14 text-lg bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                    value={formData.salary_min} 
                    onChange={e => setFormData({...formData, salary_min: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('max_salary')}</label>
                   <Input 
                    type="number"
                    className="h-14 text-lg bg-gray-50 border-gray-200 focus-visible:ring-amber-500"
                    value={formData.salary_max} 
                    onChange={e => setFormData({...formData, salary_max: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <Button 
               variant="ghost" 
               onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
               disabled={currentStep === 0}
               className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6"
             >
               <ArrowLeft className="w-5 h-5 rtl:hidden mr-2" /> 
               <ArrowRight className="w-5 h-5 hidden rtl:block ml-2" />
               {t('back')}
            </Button>
            
            <Button 
              onClick={() => setCurrentStep(Math.min(2, currentStep + 1))} 
              disabled={
                (currentStep === 0 && (!formData.title || !formData.location)) ||
                (currentStep === 1 && (!formData.description))
              }
              size="lg"
              className="rounded-full px-8 bg-gray-900 hover:bg-gray-800 text-white shadow-lg disabled:opacity-30"
            >
              {currentStep === 1 ? t('finish') : t('continue')} 
               <ArrowRight className="w-5 h-5 rtl:hidden ml-2" />
               <ArrowLeft className="w-5 h-5 hidden rtl:block mr-2" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
