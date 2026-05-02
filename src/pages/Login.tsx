import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Briefcase, User as UserIcon, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Role } from '../types';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [role, setRole] = useState<Role>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin' && (!name || !email || !phone)) return;

    setUser({
      id: role === 'admin' ? 'admin-1' : `usr-${Date.now()}`,
      email: role === 'admin' ? 'admin@sarezh.com' : email,
      phone: role === 'admin' ? '' : phone,
      name: role === 'admin' ? 'System Admin' : name,
      role,
      created_at: new Date().toISOString()
    });

    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="mx-auto max-w-md w-full mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login_title')}</h1>
        <p className="text-sm text-gray-500">{t('login_subtitle')}</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => setRole('candidate')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'candidate' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('candidate')}</span>
        </button>
        <button
          onClick={() => setRole('employer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'employer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Briefcase className="h-4 w-4" />
           <span className="hidden sm:inline">{t('employer')}</span>
        </button>
         <button
          onClick={() => setRole('admin')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">{t('admin')}</span>
        </button>
      </div>

      <form onSubmit={handleDemoLogin} className="space-y-5">
        {role !== 'admin' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('full_name')}</label>
               <Input 
                required 
                placeholder="John Doe" 
                 className="h-14 font-medium"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('email')}</label>
               <Input 
                required 
                type="email" 
                 className="h-14 font-medium"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('phone')}</label>
               <Input 
                required 
                type="tel" 
                 className="h-14 font-medium"
                placeholder="07XX XXX XXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </>
        )}
        
        <div className="pt-6">
          <Button type="submit" className="w-full h-14 text-lg rounded-xl bg-gray-900 hover:bg-gray-800">
            {role === 'admin' ? t('enter_admin') : t('login_btn')}
          </Button>
        </div>
      </form>
      
      <p className="text-xs text-center text-gray-400 mt-8 leading-relaxed">
        {t('login_demo_notice')}
      </p>
    </div>
  );
}
