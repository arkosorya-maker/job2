import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'motion/react';
import { Mail, User as UserIcon, Phone } from 'lucide-react';
import { Role } from '../../types';
import { useTranslation } from 'react-i18next';

interface InlineAuthProps {
  role: Role;
  onComplete: () => void;
  title?: string;
  description?: string;
}

export function InlineAuth({ role, onComplete, title, description }: InlineAuthProps) {
  const { t } = useTranslation();
  const { setUser } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const displayTitle = title || t('almost_done');
  const displayDesc = description || t('create_acc_desc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    // Simulate Auth
    setUser({
      id: `usr-${Date.now()}`,
      email,
      phone,
      name,
      role,
      created_at: new Date().toISOString()
    });

    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md w-full mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayTitle}</h3>
        <p className="text-gray-500">{displayDesc}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
             </div>
             <Input 
               required 
               className="pl-10 rtl:pl-3 rtl:pr-10"
               placeholder={t('full_name')} 
               value={name}
               onChange={e => setName(e.target.value)}
             />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('email_address')}</label>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
                <Mail className="h-5 w-5 text-gray-400" />
             </div>
              <Input 
                required 
                type="email" 
                className="pl-10 rtl:pl-3 rtl:pr-10"
                placeholder={t('email_address')}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
                <Phone className="h-5 w-5 text-gray-400" />
             </div>
              <Input 
                required 
                type="tel" 
                className="pl-10 rtl:pl-3 rtl:pr-10"
                placeholder={t('phone')}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
          </div>
        </div>
        
        <div className="pt-6">
          <Button type="submit" className="w-full h-12 text-base rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-md">
            {t('complete_submission')}
          </Button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4">
           {t('demo_notice')}
        </p>
      </form>
    </motion.div>
  );
}
