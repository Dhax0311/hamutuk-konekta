import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  PlusCircle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import db from '../lib/offline/db';
import { useAuth } from '../features/context/AuthContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export function OfficialWarnings() {
  const { user, isCoordinator, isAdmin } = useAuth();
  const { t, lang } = useLanguage();

  const [warnings, setWarnings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New warning form
  const [source, setSource] = useState('DNMG - Meteorolojia Timor-Leste');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('METEOROLOGICAL');
  const [severity, setSeverity] = useState('WARNING');
  const [targetArea, setTargetArea] = useState('Munisípiu Viqueque (Kosta Súl)');
  const [validUntil, setValidUntil] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadWarnings() {
      try {
        const items = await db.warnings.reverse().toArray();
        setWarnings(items);
      } catch (err) {
        console.error(err);
      }
    }
    loadWarnings();
  }, []);

  const handleCreateWarning = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newWarn = {
      id: `warn-${Date.now().toString().slice(-4)}`,
      source,
      title,
      category,
      severity,
      issued_at: new Date().toISOString(),
      valid_until: validUntil ? new Date(validUntil).toISOString() : null,
      target_area: targetArea,
      verification_status: 'OFFICIALLY_VERIFIED',
      dissemination_status: 'ACTIVE',
      description,
      is_demo: true
    };

    try {
      await db.warnings.add(newWarn);
      setWarnings((prev) => [newWarn, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const isExpired = (validUntilStr) => {
    if (!validUntilStr) return false;
    return new Date(validUntilStr) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              {t('navWarnings')}
            </h1>
            <Badge variant="demo">DEMO REGISTER</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Rejistu avizu ofisiál husi Diretoria Nasionál Meteorolojia (DNMG) no Protesaun Sivíl.'
              : 'Register of official early warnings from national agencies (DNMG & Civil Protection).'}
          </p>
        </div>

        {(isCoordinator || isAdmin) && (
          <Button
            variant="emergency"
            size="md"
            icon={PlusCircle}
            onClick={() => setIsModalOpen(true)}
          >
            {t('publishWarningBtn')}
          </Button>
        )}
      </div>

      {/* Authority Notice */}
      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          {lang === 'tet'
            ? 'Sistema HAMUTUK la halo prediksaun meteorolójiku rasik. Avizu sira mai de\'it husi autoridade kompetente nasionál.'
            : 'HAMUTUK does not predict weather or generate meteorological forecasts. It disseminates warnings issued by certified national authorities.'}
        </span>
      </div>

      {/* Warnings List */}
      <div className="space-y-4">
        {warnings.length === 0 ? (
          <Card>
            <EmptyState
              title={lang === 'tet' ? 'La iha avizu ativu' : 'No active warnings'}
              description={lang === 'tet' ? 'Rejistu avizu ofisiál mamuk.' : 'The warnings register is clear.'}
            />
          </Card>
        ) : (
          warnings.map((warn) => {
            const expired = isExpired(warn.valid_until);

            return (
              <Card
                key={warn.id}
                className={`overflow-hidden border ${
                  expired
                    ? 'border-amber-300 bg-amber-50/40'
                    : warn.severity === 'WARNING'
                    ? 'border-red-200 bg-red-50/15'
                    : 'border-amber-200 bg-amber-50/15'
                }`}
              >
                {expired && (
                  <div className="bg-amber-100/90 text-amber-900 px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{t('outdatedWarningNote')}</span>
                  </div>
                )}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          expired
                            ? 'default'
                            : warn.severity === 'WARNING'
                            ? 'emergency'
                            : 'warning'
                        }
                      >
                        {expired ? (lang === 'tet' ? 'EXPIRADU' : 'EXPIRED') : warn.severity}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500 uppercase">{warn.category}</span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono">
                      ID: {warn.id}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] mb-1.5">
                    {warn.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed">
                    {warn.description}
                  </p>

                  <div className="p-3 bg-white rounded-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('officialSource')}</span>
                      <span className="font-semibold text-slate-900">{warn.source}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('targetArea')}</span>
                      <span className="font-semibold text-slate-900">{warn.target_area}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('validUntil')}</span>
                      <span className={`font-semibold ${expired ? 'text-rose-600' : 'text-slate-900'}`}>
                        {warn.valid_until ? new Date(warn.valid_until).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{lang === 'tet' ? 'Publikadu:' : 'Issued:'} {new Date(warn.issued_at).toLocaleString()}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {warn.verification_status}
                  </span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Publish Warning Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('publishWarningBtn')}
      >
        <form onSubmit={handleCreateWarning} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('officialSource')} *
            </label>
            <input
              type="text"
              required
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'tet' ? 'Títulu Avizu' : 'Warning Title'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Avizu Mota Sae iha Uato-Lari..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="METEOROLOGICAL">Meteorolojia (DNMG)</option>
                <option value="HYDROLOGICAL">Idrolojia (Mota)</option>
                <option value="INFRASTRUCTURE">Infraestrutura</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Severidade
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="WARNING">WARNING (Kritiku)</option>
                <option value="CAUTION">CAUTION (Kautela)</option>
                <option value="ADVISORY">ADVISORY (Informativu)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('targetArea')}
            </label>
            <input
              type="text"
              required
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('validUntil')} (Data &amp; Oras)
            </label>
            <input
              type="datetime-local"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskrisaun Kompletu
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskrisaun ofisiál husi boletim..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              {t('cancelBtn')}
            </Button>
            <Button type="submit" variant="emergency" size="sm">
              {t('publishWarningBtn')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default OfficialWarnings;
