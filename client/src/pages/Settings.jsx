import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  User,
  Lock,
  RefreshCw,
  Info,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../features/context/AuthContext';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import db from '../lib/offline/db';

export function Settings() {
  const { user } = useAuth();
  const { isOnline, pendingReportsCount, triggerSync } = useNetwork();
  const { lang, setLang, t } = useLanguage();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearLocalCache = async () => {
    if (window.confirm(lang === 'tet' ? 'Tebes hakarak hamoos relatóriu lokal sira? (Relatóriu sira ne\'ebé sincronizadu ona sei la lakon iha servidor)' : 'Clear local cached data?')) {
      await db.reports.where('sync_status').equals('SERVER_ACKNOWLEDGED').delete();
      alert(lang === 'tet' ? 'Cache lokal hamoos ona.' : 'Local cache cleaned.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
            {t('navSettings')}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Konfigurasaun lian, perfil utilizador, no memória offline aparellu nian.'
              : 'Preferences, user profile, language options and offline storage.'}
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'tet' ? 'Konfigurasaun rai ho susesu!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* 1. Language Preference */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0B1F3A]" />
            <CardTitle>{lang === 'tet' ? 'Preferénsia Lian (Language)' : 'Language Preference'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-[#64748B]">
            {lang === 'tet'
              ? 'HAMUTUK fó prioridade ba Lian Tetum atu fasilita ofisiál suku sira iha terenu.'
              : 'HAMUTUK prioritises Tetum for field suco officers, with English demonstration support.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setLang('tet')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                lang === 'tet'
                  ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 ring-2 ring-[#0B1F3A]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-[#0B1F3A]">Tetum (Prinsipál)</span>
                {lang === 'tet' && <CheckCircle2 className="w-4 h-4 text-[#0B1F3A]" />}
              </div>
              <p className="text-xs text-[#64748B]">Lian ofisiál ba ofisiál suku no kordenadór iha Timor-Leste.</p>
            </button>

            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                lang === 'en'
                  ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 ring-2 ring-[#0B1F3A]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-[#0B1F3A]">English (Demonstration)</span>
                {lang === 'en' && <CheckCircle2 className="w-4 h-4 text-[#0B1F3A]" />}
              </div>
              <p className="text-xs text-[#64748B]">Secondary language for evaluation &amp; international challenge demonstration.</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. User Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#0B1F3A]" />
            <CardTitle>{lang === 'tet' ? 'Perfil Utilizador Autorizadu' : 'User Profile'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Naran Kompletu</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Email</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Kargu / Papél</label>
              <input
                type="text"
                disabled
                value={user?.role || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Área Responsabilidade</label>
              <input
                type="text"
                disabled
                value={user?.area || 'Munisípiu Viqueque'}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Offline Storage & Cache Maintenance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#0B1F3A]" />
            <CardTitle>{lang === 'tet' ? 'Memória Offline & IndexedDB' : 'Offline Storage Management'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <p className="text-[#64748B]">
            {lang === 'tet'
              ? 'Dadus relatóriu offline sira rai iha memória seguru navegador (Dexie IndexedDB). Relatóriu ne\'ebé seidauk sincroniza sei la lakon bainhira refresh pájina.'
              : 'Local records are stored in browser IndexedDB. They persist across page reloads until sent to the server.'}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-[#0B1F3A] block">
                {lang === 'tet' ? 'Limpeza Cache Sincronizadu' : 'Clean Acknowledged Cache'}
              </span>
              <span className="text-[11px] text-slate-500">
                {lang === 'tet' ? 'Hamoos de\'it relatóriu sira ne\'ebé simu ona husi servidor sentrál.' : 'Deletes only records that already reached the central server.'}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={Trash2}
              onClick={handleClearLocalCache}
            >
              {lang === 'tet' ? 'Hamoos Cache' : 'Clean Cache'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. About HAMUTUK Section */}
      <Card className="border-slate-300 bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#0B1F3A]" />
            <CardTitle>About HAMUTUK 2.0</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-[#253246] leading-relaxed">
          <p>
            <strong>HAMUTUK 2.0 — Disaster Coordination &amp; Network Resilience</strong> mak protótipu ne\'ebé kria espesialmente ba <em>Vorakai Konekta Challenge (Grand Challenge C: Disaster Resilience &amp; Early Warning)</em> iha Timor-Leste ho kontestu pilotu iha Munisípiu Viqueque.
          </p>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
            <p className="font-bold text-xs mb-1">Nota Importante Kompetisaun:</p>
            <p className="text-[11px]">
              Ne\'e mak konseitu protótipu no demonstrasaun teknolojia offline-first. Aplikaun ne\'e la subtitui servisu emerjénsia nasionál ka triajen médiku, no la halo prediksaun meteorolójiku rasik.
            </p>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Versaun: 2.0.0-PROTOTYPE • React 19 + Vite + Tailwind v4 + Dexie IndexedDB + Workbox PWA
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
