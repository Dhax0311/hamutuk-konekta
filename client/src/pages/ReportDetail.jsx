import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileWarning,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  User,
  Check,
  Send
} from 'lucide-react';
import db from '../lib/offline/db';
import { useAuth } from '../features/context/AuthContext';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCoordinator, isAdmin } = useAuth();
  const { isOnline, triggerSync } = useNetwork();
  const { t, lang } = useLanguage();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    async function loadReport() {
      try {
        const item = await db.reports.get(id);
        setReport(item || null);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleVerifyReport = async () => {
    if (!report) return;
    try {
      await db.reports.update(report.client_report_id, {
        verification_status: 'VERIFIED',
        verified_by: user?.name || 'Kordenadór Munisípiu',
        verified_at: new Date().toISOString()
      });
      setReport((prev) => ({
        ...prev,
        verification_status: 'VERIFIED',
        verified_by: user?.name,
        verified_at: new Date().toISOString()
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateFollowUp = async (status) => {
    if (!report) return;
    try {
      await db.reports.update(report.client_report_id, {
        follow_up_status: status
      });
      setReport((prev) => ({
        ...prev,
        follow_up_status: status
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !report) return;

    const updatedNotes = report.follow_up_notes
      ? `${report.follow_up_notes}\n[${user?.name || 'Ofisiál'}]: ${newNote}`
      : `[${user?.name || 'Ofisiál'}]: ${newNote}`;

    try {
      await db.reports.update(report.client_report_id, {
        follow_up_notes: updatedNotes
      });
      setReport((prev) => ({ ...prev, follow_up_notes: updatedNotes }));
      setNewNote('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        {lang === 'tet' ? 'Halo daudaun leitura relatóriu...' : 'Loading report...'}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-base font-semibold text-slate-700">
          {lang === 'tet' ? 'Relatóriu la hetan iha aparellu' : 'Report not found on this device'}
        </p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/reports')}>
          {lang === 'tet' ? 'Fila ba Relatóriu Hotu' : 'Back to Reports'}
        </Button>
      </div>
    );
  }

  const getCategoryLabel = (cat) => t(`inc_${cat}`) || cat;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back & actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'tet' ? 'Fila ba Lista Relatóriu' : 'Back to Reports List'}</span>
        </button>

        <div className="flex items-center gap-2">
          {report.sync_status !== 'SERVER_ACKNOWLEDGED' && (
            <Button
              variant="warning"
              size="sm"
              icon={RefreshCw}
              onClick={triggerSync}
              disabled={!isOnline}
            >
              {lang === 'tet' ? 'Sincroniza Agora' : 'Sync Now'}
            </Button>
          )}

          {(isCoordinator || isAdmin) && report.verification_status !== 'VERIFIED' && (
            <Button
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              onClick={handleVerifyReport}
            >
              {lang === 'tet' ? 'Verifika Relatóriu' : 'Verify Report'}
            </Button>
          )}
        </div>
      </div>

      {/* Sync Status Banner */}
      {report.sync_status === 'SERVER_ACKNOWLEDGED' ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">
              {lang === 'tet' ? 'Simu no Rekonhese ona husi Servidor Sentrál' : 'Server Acknowledged & Received'}
            </p>
            <p className="text-emerald-800 mt-0.5">
              {lang === 'tet'
                ? `Servidor sentrál munisípiu simu ona relatóriu ne'e iha ${new Date(report.server_ack_at || report.created_at).toLocaleString('tet-TL')}.`
                : `Centrally registered at ${new Date(report.server_ack_at || report.created_at).toLocaleString()}.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">
              {lang === 'tet' ? 'Rai iha Aparellu Ne\'e De\'it — Seidauk To\'o Servidor Sentrál' : 'Saved Locally on Device — Not Yet Received By Server'}
            </p>
            <p className="text-amber-800 mt-0.5">
              {lang === 'tet'
                ? 'Relatóriu ne\'e rai seguru iha IndexedDB lokál. Sei haruka ba servidor sentrál bainhira rede internet fila ka uza asaun sincroniza.'
                : 'This report exists only in local device storage and will be submitted once connectivity is restored.'}
            </p>
          </div>
        </div>
      )}

      {/* Report Summary Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {report.client_report_id}
              </span>
              <Badge variant="demo">DEMO DATA</Badge>
              <Badge
                variant={
                  report.priority === 'CRITICAL'
                    ? 'emergency'
                    : report.priority === 'HIGH'
                    ? 'warning'
                    : 'default'
                }
              >
                {t(`prio_${report.priority}`)}
              </Badge>
            </div>
            <CardTitle className="text-xl mt-1.5">
              {getCategoryLabel(report.category)} — {report.administrative_post}, Suku {report.suco}
            </CardTitle>
          </div>

          <div className="text-left sm:text-right text-xs text-[#64748B]">
            <p>{lang === 'tet' ? 'Gravadu:' : 'Recorded:'} {new Date(report.created_at).toLocaleString()}</p>
            <p>{lang === 'tet' ? 'Relatór:' : 'Reporter:'} {report.reporter_name} ({report.reporter_role})</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Location details */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Munisípiu / Postu</span>
              <span className="font-semibold text-slate-900">{report.municipality} • {report.administrative_post}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Suku / Aldeia</span>
              <span className="font-semibold text-slate-900">{report.suco} {report.aldeia ? `• ${report.aldeia}` : ''}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Kordenada / Referénsia</span>
              <span className="font-mono text-slate-800">{report.coordinates || report.location_description || 'Referénsia la disponivel'}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              {lang === 'tet' ? 'Deskrisaun Akontesimentu' : 'Incident Description'}
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
              {report.description}
            </p>
          </div>

          {/* Immediate Needs */}
          {report.immediate_needs && report.immediate_needs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                {lang === 'tet' ? 'Nesesidade Komunidade Ne\'ebé Relata' : 'Reported Community Needs'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.immediate_needs.map((n) => (
                  <span
                    key={n}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-800 border border-blue-200"
                  >
                    • {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline & Verification history */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              {lang === 'tet' ? 'Istóriku & Timeline Relatóriu' : 'Timeline & Verification History'}
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">
                    {lang === 'tet' ? 'Relatóriu Kria iha Aparellu Lokál' : 'Report Created on Local Device'}
                  </p>
                  <p className="text-slate-500">
                    {new Date(report.created_at).toLocaleString()} • {report.reporter_name}
                  </p>
                </div>
              </div>

              {report.server_ack_at && (
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800">
                      {lang === 'tet' ? 'Servidor Sentrál Simu ho Susesu' : 'Central Server Acknowledged'}
                    </p>
                    <p className="text-slate-500">
                      {new Date(report.server_ack_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {report.verification_status === 'VERIFIED' && (
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-purple-800">
                      {lang === 'tet' ? 'Verifikadu husi Kordenadór' : 'Verified by Coordinator'}
                    </p>
                    <p className="text-slate-500">
                      {report.verified_by || 'Kordenadór Munisípiu'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Follow-up notes */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {lang === 'tet' ? 'Nota Akompanhamentu & Resposta' : 'Follow-up Notes & Response'}
              </h4>
              <div className="flex items-center gap-1.5 text-xs">
                <span>{lang === 'tet' ? 'Status:' : 'Status:'}</span>
                <span className="font-bold text-[#0B1F3A] bg-slate-100 px-2 py-0.5 rounded">
                  {report.follow_up_status || 'PENDING'}
                </span>
              </div>
            </div>

            {report.follow_up_notes && (
              <pre className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 whitespace-pre-wrap font-sans border border-slate-200">
                {report.follow_up_notes}
              </pre>
            )}

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={lang === 'tet' ? 'Aumenta nota foun kona-ba apoiu ka distribuisaun...' : 'Add follow-up note...'}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
              <Button type="submit" variant="secondary" size="sm" icon={Send}>
                {lang === 'tet' ? 'Aumenta' : 'Add Note'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReportDetail;
