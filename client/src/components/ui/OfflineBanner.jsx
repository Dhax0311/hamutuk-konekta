import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNetwork } from '../../features/context/NetworkContext';
import { useLanguage } from '../../features/context/LanguageContext';
import Button from './Button';

export function OfflineBanner() {
  const {
    isOnline,
    isSimulatedOffline,
    toggleSimulationMode,
    pendingReportsCount,
    lastSyncTime,
    triggerSync,
    isSyncing,
    syncFeedback
  } = useNetwork();
  const { t, lang } = useLanguage();

  return (
    <div className="w-full flex flex-col z-30">
      {/* Toast Feedback if any */}
      {syncFeedback && (
        <div
          className={`px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between border-b ${
            syncFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            {syncFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Persistent Status Bar */}
      {!isOnline ? (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm shadow-inner transition-colors">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-black/20 rounded-md">
                <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
              </span>
              <div>
                <p className="font-semibold tracking-wide flex items-center gap-1.5">
                  {lang === 'tet' ? 'MODU OFFLINE ACTIVU' : 'OFFLINE MODE ACTIVE'}
                  {isSimulatedOffline && (
                    <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded font-mono">
                      {lang === 'tet' ? 'SIMULASAUN' : 'SIMULATION'}
                    </span>
                  )}
                </p>
                <p className="text-amber-100 text-xs hidden sm:block">
                  {lang === 'tet'
                    ? 'Aparellu la ligadu ba internet. Relatóriu foun sei rai iha telemóvel no haruka bainhira rede fila.'
                    : 'Device is offline. New reports will be saved locally in IndexedDB and sent when connected.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {pendingReportsCount > 0 && (
                <span className="bg-amber-800/80 px-2.5 py-1 rounded-md font-semibold border border-amber-400/40">
                  {pendingReportsCount} {lang === 'tet' ? 'relatóriu hein rede' : 'pending sync'}
                </span>
              )}
              <button
                type="button"
                onClick={toggleSimulationMode}
                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer"
                title={lang === 'tet' ? 'Troka simulasaun rede' : 'Toggle network simulation'}
              >
                {isSimulatedOffline
                  ? (lang === 'tet' ? 'Koneka Fali (Simulasaun)' : 'Reconnect (Sim)')
                  : (lang === 'tet' ? 'Kotu Rede (Simulasaun)' : 'Simulate Offline')}
              </button>
            </div>
          </div>
        </div>
      ) : pendingReportsCount > 0 ? (
        <div className="bg-[#0B1F3A] text-white px-4 py-2 text-xs sm:text-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-medium text-amber-300">
                {pendingReportsCount} {lang === 'tet' ? 'relatóriu lokal hein atu sincroniza ba servidor sentrál' : 'reports waiting on device to sync'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="warning"
                size="sm"
                icon={RefreshCw}
                isLoading={isSyncing}
                onClick={triggerSync}
                className="text-xs"
              >
                {lang === 'tet' ? 'Sincroniza Agora' : 'Synchronise Now'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default OfflineBanner;
