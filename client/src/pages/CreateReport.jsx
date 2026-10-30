import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileWarning,
  MapPin,
  Clock,
  AlertTriangle,
  Save,
  CheckCircle2,
  WifiOff,
  Navigation,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { DEMO_ADMINISTRATIVE_AREAS } from '../lib/mockData';
import { useAuth } from '../features/context/AuthContext';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import { saveReportLocally } from '../lib/offline/reportsRepository';
import { syncSingleReport } from '../lib/sync/syncEngine';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export function CreateReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline, refreshPendingCount } = useNetwork();
  const { t, lang } = useLanguage();

  const [category, setCategory] = useState('flooding');
  const [selectedPost, setSelectedPost] = useState(DEMO_ADMINISTRATIVE_AREAS.posts[0].name);
  const [selectedSuco, setSelectedSuco] = useState(DEMO_ADMINISTRATIVE_AREAS.posts[0].sucos[0]);
  const [aldeia, setAldeia] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [incidentTime, setIncidentTime] = useState(() => {
    return new Date().toISOString().slice(0, 16);
  });
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [needs, setNeeds] = useState(['water']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const currentPostObject = DEMO_ADMINISTRATIVE_AREAS.posts.find((p) => p.name === selectedPost);

  const handlePostChange = (e) => {
    const postName = e.target.value;
    setSelectedPost(postName);
    const found = DEMO_ADMINISTRATIVE_AREAS.posts.find((p) => p.name === postName);
    if (found && found.sucos.length > 0) {
      setSelectedSuco(found.sucos[0]);
    }
  };

  const handleNeedToggle = (needKey) => {
    setNeeds((prev) =>
      prev.includes(needKey) ? prev.filter((k) => k !== needKey) : [...prev, needKey]
    );
  };

  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        },
        () => {
          // Fallback demo coordinates for Viqueque
          setCoordinates('-8.8576, 126.3644 (Viqueque)');
        }
      );
    } else {
      setCoordinates('-8.8576, 126.3644 (Viqueque)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // 1. Always validate and save locally FIRST
      const savedReport = await saveReportLocally(
        {
          category,
          municipality: 'Viqueque',
          administrative_post: selectedPost,
          suco: selectedSuco,
          aldeia: aldeia || 'Aldeia Sentrál',
          location_description: locationDescription,
          coordinates: coordinates || null,
          incident_time: incidentTime,
          description,
          priority,
          immediate_needs: needs
        },
        user
      );

      const clientReportId = savedReport.client_report_id;
      await refreshPendingCount();

      // 2. If online, attempt immediate sync
      if (isOnline) {
        const syncRes = await syncSingleReport(clientReportId);
        await refreshPendingCount();

        if (syncRes.success) {
          setStatusMessage({
            type: 'acknowledged',
            clientReportId,
            text: lang === 'tet'
              ? 'Simu no rekonhese ona husi servidor sentrál!'
              : 'Received and acknowledged by central server!'
          });
        } else {
          // Network error or timeout: report is safely preserved in IndexedDB
          setStatusMessage({
            type: 'saved_locally',
            clientReportId,
            text: lang === 'tet'
              ? 'Rai ona iha aparellu ne\'e — Seidauk simu husi servidor sentrál (Koko haruka fali bainhira rede estável).'
              : 'Saved on this device — not yet received by the central server (will retry when connection is stable).'
          });
        }
      } else {
        // Offline: Report saved locally in IndexedDB
        setStatusMessage({
          type: 'saved_locally',
          clientReportId,
          text: lang === 'tet'
            ? 'Rai ona iha aparellu ne\'e — Seidauk simu husi servidor sentrál.'
            : 'Saved on this device — not yet received by the central server.'
        });
      }

      setTimeout(() => {
        navigate(`/reports/${clientReportId}`);
      }, 1800);
    } catch (err) {
      console.error('Error saving report:', err);
      alert(err.message || 'Erru durante rai relatóriu iha aparellu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with back navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'tet' ? 'Fila ba Relatóriu' : 'Back to Reports'}</span>
        </button>

        <Badge variant="demo">DEMO FORM</Badge>
      </div>

      {/* Offline Status Warning Banner */}
      {!isOnline ? (
        <div className="p-4 rounded-xl bg-amber-500 text-slate-900 border border-amber-600 shadow-xs flex items-start gap-3">
          <WifiOff className="w-5 h-5 shrink-0 mt-0.5 text-slate-950" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold tracking-tight text-slate-950">
              {lang === 'tet'
                ? 'OFFLINE — Relatóriu sei rai seguru iha aparellu ne\'e'
                : 'OFFLINE — This report will be stored on this device'}
            </p>
            <p className="text-slate-900 mt-0.5">
              {lang === 'tet'
                ? 'Informasaun sei sincroniza automatikamente bainhira rede internet fila fali. Servidor sentrál seidauk bele simu agora.'
                : 'Report will synchronise when network connection is restored. Central server cannot receive it now.'}
            </p>
          </div>
        </div>
      ) : null}

      {/* Success / Status Message after submission */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
            statusMessage.type === 'acknowledged'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${statusMessage.type === 'acknowledged' ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div>
            <p className="font-bold">{statusMessage.text}</p>
            <p className="mt-0.5 font-mono text-xs">
              ID: {statusMessage.clientReportId}
            </p>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {lang === 'tet' ? 'Formuláriu Relatóriu Dezastre Foun' : 'Create Emergency Incident Report'}
          </CardTitle>
          <p className="text-xs text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Prenxe informasaun esensiál hodi apoiu asaun no resposta koordinasaun munisípiu.'
              : 'Fill key incident details for municipal coordination and civil protection response.'}
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {/* 1. Incident Category */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                1. {lang === 'tet' ? 'Kategoria Dezastre' : 'Incident Category'} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'flooding', label: t('inc_flooding') },
                  { id: 'landslide', label: t('inc_landslide') },
                  { id: 'strong_wind', label: t('inc_strong_wind') },
                  { id: 'fire', label: t('inc_fire') },
                  { id: 'road_disruption', label: t('inc_road_disruption') },
                  { id: 'medical_emergency', label: t('inc_medical_emergency') },
                  { id: 'other', label: t('inc_other') }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`p-3 rounded-lg border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      category === item.id
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-xs font-semibold'
                        : 'border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Priority Level */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                2. {lang === 'tet' ? 'Nivel Prioridade' : 'Priority Level'} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'CRITICAL', label: t('prio_CRITICAL'), color: 'border-red-400 text-red-700 bg-red-50' },
                  { id: 'HIGH', label: t('prio_HIGH'), color: 'border-amber-400 text-amber-800 bg-amber-50' },
                  { id: 'MEDIUM', label: t('prio_MEDIUM'), color: 'border-blue-300 text-blue-800 bg-blue-50' },
                  { id: 'LOW', label: t('prio_LOW'), color: 'border-slate-300 text-slate-700 bg-slate-50' }
                ].map((prio) => (
                  <button
                    key={prio.id}
                    type="button"
                    onClick={() => setPriority(prio.id)}
                    className={`py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                      priority === prio.id
                        ? `${prio.color} ring-2 ring-offset-1 ring-slate-400 shadow-xs`
                        : 'border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {prio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Location Hierarchy */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                3. {lang === 'tet' ? 'Lokalizasaun Administrativu (Munisípiu Viqueque)' : 'Administrative Location'} *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    {lang === 'tet' ? 'Postu Administrativu' : 'Post'}
                  </label>
                  <select
                    value={selectedPost}
                    onChange={handlePostChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  >
                    {DEMO_ADMINISTRATIVE_AREAS.posts.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    {lang === 'tet' ? 'Suku' : 'Suco'}
                  </label>
                  <select
                    value={selectedSuco}
                    onChange={(e) => setSelectedSuco(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  >
                    {currentPostObject?.sucos.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    {lang === 'tet' ? 'Aldeia' : 'Aldeia'}
                  </label>
                  <input
                    type="text"
                    value={aldeia}
                    onChange={(e) => setAldeia(e.target.value)}
                    placeholder="ex: Namanei"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  />
                </div>
              </div>

              {/* Coordinates & Location description */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-slate-600">
                      {lang === 'tet' ? 'Kordenada GPS (Opsiun)' : 'GPS Coordinates (Optional)'}
                    </label>
                    <button
                      type="button"
                      onClick={handleGetCoordinates}
                      className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      {lang === 'tet' ? 'Foti Pozisaun' : 'Get Location'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    placeholder="-8.8576, 126.3644"
                    className="w-full px-3 py-2 text-xs font-mono border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    {lang === 'tet' ? 'Deskrisaun Fatin / Ponto Referénsia' : 'Location Reference'}
                  </label>
                  <input
                    type="text"
                    value={locationDescription}
                    onChange={(e) => setLocationDescription(e.target.value)}
                    placeholder={lang === 'tet' ? 'ex: Besik ponte provizóriu mota Sahe' : 'e.g. Near river Sahe wooden bridge'}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Incident Time & Description */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                4. {lang === 'tet' ? 'Deskrisaun Akontesimentu' : 'Incident Details'} *
              </label>

              <div className="mb-3">
                <label className="block text-xs text-slate-600 mb-1">
                  {lang === 'tet' ? 'Oras Akontesimentu (se hatene)' : 'Time of Incident'}
                </label>
                <input
                  type="datetime-local"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  {lang === 'tet' ? 'Deskrisaun badak kona-ba impaktu no estragus' : 'Brief description of damage and impact'} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={lang === 'tet' ? 'Hakerek badak kona-ba uma hira mak hetan impaktu, estrada kotu, ka populasaun sira...' : 'Briefly describe affected households, road access, injuries...'}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
            </div>

            {/* 5. Immediate Community Needs */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
                5. {lang === 'tet' ? 'Nesesidade Komunidade Urjente' : 'Immediate Community Needs'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'water', label: lang === 'tet' ? "Be'e Moos" : 'Clean Water' },
                  { id: 'food', label: lang === 'tet' ? 'Ai-han (Báziku)' : 'Food' },
                  { id: 'shelter', label: lang === 'tet' ? 'Lona / Abrigu' : 'Shelter / Tarpaulins' },
                  { id: 'medicine', label: lang === 'tet' ? 'Ai-moruk / Primeiru Sokorru' : 'Medical Care' },
                  { id: 'transport', label: lang === 'tet' ? 'Transporte / Evakuasaun' : 'Transport' }
                ].map((item) => {
                  const isChecked = needs.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNeedToggle(item.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-[#64748B]">
              <span>{lang === 'tet' ? 'Relatór:' : 'Reporter:'} </span>
              <strong className="text-[#0B1F3A]">{user?.name || 'Ofisiál Suku'}</strong>
              <span className="ml-1 text-[11px] font-mono">({user?.role || 'SUCO_OFFICER'})</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate(-1)}
              >
                {t('cancelBtn')}
              </Button>

              <Button
                type="submit"
                variant="emergency"
                size="md"
                icon={Save}
                isLoading={isSubmitting}
              >
                {t('saveReportBtn')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreateReport;
