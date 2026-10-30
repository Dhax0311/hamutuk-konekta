import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../features/context/AuthContext';
import { useLanguage } from '../features/context/LanguageContext';
import Button from '../components/ui/Button';

export function Login() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  const { t, lang } = useLanguage();

  const [identifier, setIdentifier] = useState('mateus.suco@hamutuk.local');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Kredensiál la loos.');
      }
    } catch {
      setError('Problema koneksaun ka autentikasaun.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (role) => {
    loginAsDemo(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* App Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 mb-2 flex items-center justify-center">
            <img
              src="/hamutuk.png"
              alt="HAMUTUK"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
          <p className="mt-2 text-center text-xs sm:text-sm text-[#64748B]">
            {t('brandTagline')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-[#E2E8F0] sm:px-10">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-base font-semibold text-[#0B1F3A]">{t('loginTitle')}</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{t('loginSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#253246] mb-1">
                {t('usernameOrEmail')}
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@hamutuk.local"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent outline-none bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#253246] mb-1">
                {t('password')}
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent outline-none bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full text-sm font-semibold"
              >
                {t('signInBtn')}
              </Button>
            </div>
          </form>

          {/* Authorized Personnel Notice */}
          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t('authorizedNote')}</span>
          </div>

          {/* Quick Demo Switcher for Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-xs font-semibold text-[#64748B] mb-2">{t('demoAccountsTitle')}</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('SUCO_OFFICER')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs group cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#0B1F3A] block">1. Mateus da Costa (Ofisiál Suku)</span>
                  <span className="text-[10px] text-slate-500">Postu Uato-Lari, Suku Macadique</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1F3A]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('MUNICIPAL_COORDINATOR')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs group cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#0B1F3A] block">2. Helena Pinto (Kordenadór Munisípiu)</span>
                  <span className="text-[10px] text-slate-500">Munisípiu Viqueque Sentrál</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1F3A]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('ADMIN')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs group cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#0B1F3A] block">3. HAMUTUK Administrator</span>
                  <span className="text-[10px] text-slate-500">Aksesu Kompletu (Admin)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1F3A]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
