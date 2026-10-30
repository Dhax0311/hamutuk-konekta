import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import db from '../../lib/offline/db';
import { INITIAL_DEMO_REPORTS, INITIAL_DEMO_NEEDS, INITIAL_DEMO_SITES, INITIAL_DEMO_WARNINGS } from '../../lib/mockData';
import { syncPendingReports, syncSingleReport } from '../../lib/sync/syncEngine';
import { getPendingReports } from '../../lib/offline/reportsRepository';
import api from '../../lib/api/client';

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return localStorage.getItem('hamutuk_last_sync') || '2026-10-21 09:12:00';
  });
  
  // SiteWatch state & configurable stale threshold
  const [sites, setSites] = useState(INITIAL_DEMO_SITES);
  const [staleThresholdMinutes, setStaleThresholdMinutes] = useState(15);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const effectiveOnline = isBrowserOnline && !isSimulatedOffline;

  // Initialize Dexie with demo items and ensure new demo sites (Suco A & B) exist
  useEffect(() => {
    async function initDB() {
      try {
        const repCount = await db.reports.count();
        if (repCount === 0) {
          await db.reports.bulkAdd(INITIAL_DEMO_REPORTS);
        }
        const needsCount = await db.needs.count();
        if (needsCount === 0) {
          await db.needs.bulkAdd(INITIAL_DEMO_NEEDS);
        }
        const warnCount = await db.warnings.count();
        if (warnCount === 0) {
          await db.warnings.bulkAdd(INITIAL_DEMO_WARNINGS);
        }

        // Add or update sites in Dexie
        for (const s of INITIAL_DEMO_SITES) {
          const exists = await db.sites.get(s.id);
          if (!exists) {
            await db.sites.put(s);
          }
        }

        const allSites = await db.sites.toArray();
        if (allSites.length > 0) {
          setSites(allSites);
        }

        refreshPendingCount();
      } catch (err) {
        console.error('Error initializing IndexedDB:', err);
      }
    }
    initDB();
  }, []);

  const refreshPendingCount = useCallback(async () => {
    try {
      const pending = await getPendingReports();
      setPendingReportsCount(pending.length);
    } catch {
      // Fallback
    }
  }, []);

  // Real-time recalculation of site status based on stale threshold and simulation state
  const evaluateSiteStatus = useCallback((site, thresholdMin) => {
    if (site.simulation_stopped || site.status === 'UNREACHABLE') {
      return 'UNREACHABLE';
    }
    if (!site.last_heartbeat) {
      return 'UNKNOWN';
    }
    const diffMs = Date.now() - new Date(site.last_heartbeat).getTime();
    const thresholdMs = thresholdMin * 60 * 1000;

    if (diffMs > thresholdMs) {
      return 'STALE';
    }
    return 'ONLINE';
  }, []);

  // Update site statuses periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setSites((prev) =>
        prev.map((s) => ({
          ...s,
          status: evaluateSiteStatus(s, staleThresholdMinutes)
        }))
      );
    }, 10000);

    return () => clearInterval(timer);
  }, [staleThresholdMinutes, evaluateSiteStatus]);

  // Foreground sync and connectivity event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      // Foreground automatic sync on reconnect
      if (!isSimulatedOffline) {
        triggerSync();
      }
    };
    const handleOffline = () => setIsBrowserOnline(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && effectiveOnline) {
        triggerSync();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    const interval = setInterval(refreshPendingCount, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [effectiveOnline, isSimulatedOffline, refreshPendingCount]);

  const toggleSimulationMode = () => {
    setIsSimulatedOffline((prev) => {
      const nextVal = !prev;
      if (!nextVal) {
        // Just went back online: auto trigger sync
        setTimeout(() => triggerSync(), 500);
      }
      return nextVal;
    });
  };

  // Main Synchronization Function (Foreground & Retry)
  const triggerSync = async () => {
    if (!effectiveOnline) {
      setSyncFeedback({
        type: 'error',
        message: 'Labele sincroniza tanba aparellu sei iha modu OFFLINE.'
      });
      setTimeout(() => setSyncFeedback(null), 4000);
      return false;
    }

    setIsSyncing(true);
    try {
      const result = await syncPendingReports();
      await refreshPendingCount();

      if (result.timestamp) {
        setLastSyncTime(result.timestamp);
      }

      setSyncFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
      });
      setTimeout(() => setSyncFeedback(null), 4500);

      return result.success;
    } catch (err) {
      console.error('Trigger sync error:', err);
      setSyncFeedback({
        type: 'error',
        message: 'Sincronizasaun falla. Favor koko fali.'
      });
      setTimeout(() => setSyncFeedback(null), 4500);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync a single report
  const triggerSingleSync = async (clientReportId) => {
    if (!effectiveOnline) {
      alert('Aparellu offline. Labele haruka relatóriu agora.');
      return false;
    }
    const res = await syncSingleReport(clientReportId);
    await refreshPendingCount();
    setSyncFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message
    });
    setTimeout(() => setSyncFeedback(null), 4000);
    return res.success;
  };

  // SiteWatch Simulation Controls
  const simulateSiteHeartbeat = async (siteId) => {
    const now = new Date().toISOString();
    setSites((prev) =>
      prev.map((s) => {
        if (s.id === siteId) {
          const updated = {
            ...s,
            status: 'ONLINE',
            simulation_stopped: false,
            last_heartbeat: now,
            operator_notes: 'Heartbeat foun simu ho susesu (simulasaun telemetria).'
          };
          db.sites.put(updated).catch(() => {});
          return updated;
        }
        return s;
      })
    );

    // If online, record heartbeat to server as well
    if (effectiveOnline) {
      try {
        await api.sendHeartbeat(siteId, { status: 'ONLINE', latency_ms: Math.floor(Math.random() * 30 + 30) });
      } catch {
        // Non-blocking for simulation
      }
    }
  };

  const simulateSiteOutage = (siteId) => {
    setSites((prev) =>
      prev.map((s) => {
        if (s.id === siteId) {
          const updated = {
            ...s,
            status: 'UNREACHABLE',
            simulation_stopped: true,
            open_tickets: (s.open_tickets || 0) + 1,
            operator_notes: 'Heartbeat para (Simulasaun). Causa seidauk konfirmadu.'
          };
          db.sites.put(updated).catch(() => {});
          return updated;
        }
        return s;
      })
    );
  };

  const stopSiteSimulation = (siteId) => {
    simulateSiteOutage(siteId);
  };

  const resumeSiteSimulation = (siteId) => {
    simulateSiteHeartbeat(siteId);
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline: effectiveOnline,
        isBrowserOnline,
        isSimulatedOffline,
        toggleSimulationMode,
        isSyncing,
        triggerSync,
        triggerSingleSync,
        pendingReportsCount,
        refreshPendingCount,
        lastSyncTime,
        sites,
        staleThresholdMinutes,
        setStaleThresholdMinutes,
        simulateSiteHeartbeat,
        simulateSiteOutage,
        stopSiteSimulation,
        resumeSiteSimulation,
        syncFeedback
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
