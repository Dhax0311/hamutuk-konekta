import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Radio,
  Wifi,
  WifiOff,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Send
} from 'lucide-react';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export function SiteWatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sites, simulateSiteHeartbeat } = useNetwork();
  const { lang } = useLanguage();

  const site = sites.find((s) => s.id === id) || sites[0];
  const [operatorNotes, setOperatorNotes] = useState(site.operator_notes || '');
  const [ticketStatus, setTicketStatus] = useState('INVESTIGATION_PENDING');
  const [newAction, setNewAction] = useState('');

  const [actionsLog, setActionsLog] = useState([
    {
      id: 1,
      time: '2026-10-21 07:15',
      user: 'Operadór Tékniku Viqueque',
      action: 'Missing heartbeat detectadu husi server polling. Kazu automatiku loke.'
    },
    {
      id: 2,
      time: '2026-10-21 07:35',
      user: 'Helena Pinto (Kordenadór)',
      action: 'Kontaktu ona xefe suku via VHF radio hodi konfirma alimentasaun enerjia solar.'
    }
  ]);

  const handleAddAction = (e) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    setActionsLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString('tet-TL', { hour: '2-digit', minute: '2-digit' }),
        user: 'Operadór Munisípiu',
        action: newAction
      }
    ]);
    setNewAction('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/sitewatch')}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B1F3A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'tet' ? 'Fila ba Painél SiteWatch' : 'Back to SiteWatch'}</span>
        </button>

        <Badge variant="simulation">SIMULATION DATA</Badge>
      </div>

      {/* Main Site Details Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {site.id}
              </span>
              <Badge
                variant={
                  site.status === 'ONLINE'
                    ? 'online'
                    : site.status === 'STALE'
                    ? 'stale'
                    : site.status === 'UNREACHABLE'
                    ? 'unreachable'
                    : 'unknown'
                }
              >
                {site.status}
              </Badge>
            </div>
            <CardTitle className="text-xl mt-1.5 text-[#0B1F3A]">
              {site.name} — {site.location}
            </CardTitle>
            <p className="text-xs text-[#64748B] mt-0.5">
              Postu Administrativu: {site.post} • {site.connection_type}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Activity}
              onClick={() => simulateSiteHeartbeat(site.id)}
            >
              {lang === 'tet' ? 'Simula Heartbeat Foun' : 'Send Test Heartbeat'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Telemetry Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Enderesu IP</span>
              <span className="font-mono font-semibold text-slate-800">{site.ip_address}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Heartbeat Ikus</span>
              <span className="font-semibold text-slate-800">
                {new Date(site.last_heartbeat).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Uptime Rezultadu</span>
              <span className="font-semibold text-emerald-700">{site.uptime_percentage}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Kazu Aat Abértu</span>
              <span className="font-semibold text-slate-800">{site.open_tickets} kazu</span>
            </div>
          </div>

          {/* Diagnostic status distinction */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">
                {lang === 'tet' ? 'Distinsaun Diagnóstiku Tékniku' : 'Diagnostic State Distinction'}
              </p>
              <p className="text-xs text-amber-800 mt-1">
                {lang === 'tet'
                  ? 'Status "LA LIGADU / UNREACHABLE" dehan katak servidor la simu ping/heartbeat periódiku. Razaun loos (bateria solar mamuk, antena nakdoko, ka mikrotik aat) sei konsidera hanesan "SEIDAUK KONFIRMADU" to\'o ekipa tékniku halo inspesaun direta.'
                  : 'An unreachable status means absence of telemetry beacon. The actual physical cause remains UNCONFIRMED until technician inspection.'}
              </p>
            </div>
          </div>

          {/* Incident Ticket Section */}
          <div className="pt-2 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {lang === 'tet' ? 'Kazu Tékniku & Istóriku Intervensaun' : 'Technical Issue Ticket & Action Log'}
              </h4>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-700">
                Ticket #TK-VQ-{site.id.replace('site-', '')}
              </span>
            </div>

            <div className="space-y-3">
              {actionsLog.map((act) => (
                <div key={act.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-[#0B1F3A]">{act.user}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{act.time}</span>
                    </div>
                    <p className="text-slate-700">{act.action}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add action form */}
            <form onSubmit={handleAddAction} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder={lang === 'tet' ? 'Hakerek asaun tékniku foun ka nota diagnóstiku...' : 'Record technician action or diagnosis note...'}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
              <Button type="submit" variant="primary" size="sm" icon={Send}>
                {lang === 'tet' ? 'Rejista Asaun' : 'Add Action'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SiteWatchDetail;
