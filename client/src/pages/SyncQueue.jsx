import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  Database,
  ArrowRight,
  ShieldAlert,
  Send,
  AlertCircle
} from 'lucide-react';
import db from '../lib/offline/db';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export function SyncQueue() {
  const { isOnline, isSyncing, triggerSync, triggerSingleSync, lastSyncTime, pendingReportsCount } = useNetwork();
  const { t, lang } = useLanguage();

  const [queueItems, setQueueItems] = useState([]);
  const [retryingId, setRetryingId] = useState(null);

  const loadQueue = async () => {
    try {
      const allReports = await db.reports.reverse().sortBy('created_at');
      setQueueItems(allReports);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [pendingReportsCount, isSyncing]);

  const handleRetrySingle = async (reportId) => {
    setRetryingId(reportId);
    try {
      await triggerSingleSync(reportId);
      await loadQueue();
    } finally {
      setRetryingId(null);
    }
  };

  const pendingItems = queueItems.filter((i) => i.sync_status !== 'SERVER_ACKNOWLEDGED');
  const acknowledgedItems = queueItems.filter((i) => i.sync_status === 'SERVER_ACKNOWLEDGED');

  const getStatusLabel = (status) => {
    return t(`status_${status}`) || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              {t('navSyncQueue')}
            </h1>
            <Badge variant="default">IndexedDB Dexie</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Jere fila sincronizasaun relatóriu lokál no istóriku konfirmasaun servidor sentrál.'
              : 'Manage local queue of reports and inspect central server acknowledgements.'}
          </p>
        </div>

        <Button
          variant="warning"
          size="md"
          icon={RefreshCw}
          isLoading={isSyncing}
          disabled={!isOnline || pendingItems.length === 0}
          onClick={triggerSync}
        >
          {t('syncNowBtn')}
        </Button>
      </div>

      {/* Network Connection Status Card */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-bold text-[#0B1F3A]">
                {isOnline ? (lang === 'tet' ? 'REDE LIGADU (ONLINE)' : 'NETWORK CONNECTED') : (lang === 'tet' ? 'REDE LA LIGADU (OFFLINE)' : 'OFFLINE MODE')}
              </p>
              <p className="text-xs text-[#64748B]">
                {lang === 'tet' ? 'Sincronizasaun ikus:' : 'Last central sync:'} <span className="font-mono">{lastSyncTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
              {pendingItems.length} {lang === 'tet' ? 'hein sincronizasaun' : 'pending queue'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              {acknowledgedItems.length} {lang === 'tet' ? 'rekonhese ona' : 'server acknowledged'}
            </span>
          </div>
        </div>
      </Card>

      {/* Section 1: Pending reports on this device */}
      <Card>
        <CardHeader className="bg-amber-50/50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <CardTitle className="text-amber-900">
              {lang === 'tet' ? '1. Relatóriu Ne\'ebé Rai Iha Aparellu Ne\'e (Seidauk To\'o Servidor)' : '1. Stored on Device (Pending Server Receipt)'}
            </CardTitle>
          </div>
          <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
            {pendingItems.length}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {pendingItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">
                {lang === 'tet' ? 'La iha relatóriu pendente iha aparellu ne\'e.' : 'Queue is empty. All local reports have been received by the central server.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingItems.map((item) => (
                <div key={item.client_report_id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                        {item.client_report_id}
                      </span>
                      <Badge variant={item.sync_status || 'PENDING_SYNC'} size="sm">
                        {getStatusLabel(item.sync_status || 'PENDING_SYNC')}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-700">
                        {item.administrative_post}, Suku {item.suco}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">{item.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>{lang === 'tet' ? 'Gravadu:' : 'Recorded:'} {new Date(item.created_at).toLocaleString()}</span>
                      <span>• {lang === 'tet' ? 'Tentativa:' : 'Attempts:'} {item.attempt_count || 0}</span>
                      {item.last_error && (
                        <span className="text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {item.last_error}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={RefreshCw}
                      isLoading={retryingId === item.client_report_id}
                      onClick={() => handleRetrySingle(item.client_report_id)}
                      disabled={!isOnline}
                    >
                      {lang === 'tet' ? 'Koko Haruka' : 'Retry'}
                    </Button>

                    <Link to={`/reports/${item.client_report_id}`}>
                      <Button variant="ghost" size="sm">
                        {lang === 'tet' ? 'Detallu' : 'View'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Acknowledged by Central Server */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <CardTitle>
              {lang === 'tet' ? '2. Relatóriu Rekonhese Ona Husi Servidor Sentrál' : '2. Central Server Acknowledged Reports'}
            </CardTitle>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            {acknowledgedItems.length}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {acknowledgedItems.slice(0, 10).map((item) => (
              <div key={item.client_report_id} className="p-4 flex items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0B1F3A]">{item.client_report_id}</span>
                    <Badge variant="SERVER_ACKNOWLEDGED" size="sm">
                      {getStatusLabel('SERVER_ACKNOWLEDGED')}
                    </Badge>
                    <span className="text-slate-700 font-medium">{item.administrative_post}, Suku {item.suco}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'tet' ? 'Simu iha:' : 'Acknowledged at:'} {new Date(item.server_ack_at || item.created_at).toLocaleString()}
                  </p>
                </div>

                <Link to={`/reports/${item.client_report_id}`}>
                  <Button variant="ghost" size="sm" icon={ArrowRight}>
                    {lang === 'tet' ? 'Haree' : 'View'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SyncQueue;
