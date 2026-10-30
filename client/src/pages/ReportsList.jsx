import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileWarning,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import db from '../lib/offline/db';
import { DEMO_ADMINISTRATIVE_AREAS } from '../lib/mockData';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export function ReportsList() {
  const { pendingReportsCount, isOnline } = useNetwork();
  const { t, lang } = useLanguage();

  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPost, setFilterPost] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterSync, setFilterSync] = useState('ALL');

  useEffect(() => {
    async function loadReports() {
      try {
        const all = await db.reports.reverse().toArray();
        setReports(all);
      } catch (err) {
        console.error('Error loading reports:', err);
      }
    }
    loadReports();
  }, [pendingReportsCount]);

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.suco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.administrative_post?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.client_report_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || rep.category === filterCategory;
    const matchesPost = filterPost === 'ALL' || rep.administrative_post === filterPost;
    const matchesPriority = filterPriority === 'ALL' || rep.priority === filterPriority;
    const matchesSync =
      filterSync === 'ALL' ||
      (filterSync === 'LOCAL' && rep.sync_status !== 'SERVER_ACKNOWLEDGED') ||
      (filterSync === 'SERVER' && rep.sync_status === 'SERVER_ACKNOWLEDGED');

    return matchesSearch && matchesCategory && matchesPost && matchesPriority && matchesSync;
  });

  const getCategoryLabel = (cat) => t(`inc_${cat}`) || cat;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              {t('navReports')}
            </h1>
            <Badge variant="demo">DEMO DATA</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Rejistu relatóriu dezastre iha suku no aldeia sira munisípiu Viqueque nian.'
              : 'Disaster incident registry across sucos and aldeias in Viqueque.'}
          </p>
        </div>

        <Link to="/reports/new">
          <Button variant="emergency" size="md" icon={PlusCircle}>
            {t('navCreateReport')}
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 bg-white space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="ALL">{lang === 'tet' ? 'Tipu: Hotu-hotu' : 'Type: All'}</option>
              <option value="flooding">{t('inc_flooding')}</option>
              <option value="landslide">{t('inc_landslide')}</option>
              <option value="strong_wind">{t('inc_strong_wind')}</option>
              <option value="fire">{t('inc_fire')}</option>
              <option value="road_disruption">{t('inc_road_disruption')}</option>
              <option value="medical_emergency">{t('inc_medical_emergency')}</option>
              <option value="other">{t('inc_other')}</option>
            </select>

            <select
              value={filterPost}
              onChange={(e) => setFilterPost(e.target.value)}
              className="px-2.5 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="ALL">{lang === 'tet' ? 'Postu: Hotu-hotu' : 'Post: All'}</option>
              {DEMO_ADMINISTRATIVE_AREAS.posts.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="ALL">{lang === 'tet' ? 'Prioridade: Hotu' : 'Priority: All'}</option>
              <option value="CRITICAL">{t('prio_CRITICAL')}</option>
              <option value="HIGH">{t('prio_HIGH')}</option>
              <option value="MEDIUM">{t('prio_MEDIUM')}</option>
              <option value="LOW">{t('prio_LOW')}</option>
            </select>

            <select
              value={filterSync}
              onChange={(e) => setFilterSync(e.target.value)}
              className="px-2.5 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="ALL">{lang === 'tet' ? 'Status Sinc: Hotu' : 'Sync: All'}</option>
              <option value="SERVER">{lang === 'tet' ? 'Simu husi Servidor' : 'Server Ack'}</option>
              <option value="LOCAL">{lang === 'tet' ? 'Lokal De\'it (Hein)' : 'Local Only'}</option>
            </select>
          </div>
        </div>

        {/* Quick status tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">{t('filterBy')}:</span>
          <button
            type="button"
            onClick={() => setFilterSync('ALL')}
            className={`px-2.5 py-1 rounded-md cursor-pointer ${
              filterSync === 'ALL' ? 'bg-[#0B1F3A] text-white font-medium' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('all')} ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSync('SERVER')}
            className={`px-2.5 py-1 rounded-md cursor-pointer ${
              filterSync === 'SERVER' ? 'bg-[#0B1F3A] text-white font-medium' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'tet' ? 'Simu husi Servidor' : 'Server Ack'} (
            {reports.filter((r) => r.sync_status === 'SERVER_ACKNOWLEDGED').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSync('LOCAL')}
            className={`px-2.5 py-1 rounded-md cursor-pointer flex items-center gap-1 ${
              filterSync === 'LOCAL' ? 'bg-amber-600 text-white font-medium' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            {lang === 'tet' ? 'Lokal De\'it (Hein Sinc)' : 'Local Only'} (
            {reports.filter((r) => r.sync_status !== 'SERVER_ACKNOWLEDGED').length})
          </button>
        </div>
      </Card>

      {/* Reports Table / Card Container */}
      {filteredReports.length === 0 ? (
        <Card>
          <EmptyState
            title={lang === 'tet' ? 'Relatóriu la hetan' : 'No reports found'}
            description={
              lang === 'tet'
                ? 'La iha relatóriu dezastre ne\'ebé tuir filtru ne\'e. Koko hili filtru seluk.'
                : 'No reports matched your search or filters.'
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">ID &amp; Tipu</th>
                  <th className="px-4 py-3">Fatin (Postu / Suku)</th>
                  <th className="px-4 py-3">Prioridade</th>
                  <th className="px-4 py-3">Status Sincronizasaun</th>
                  <th className="px-4 py-3">Status Verifikasaun</th>
                  <th className="px-4 py-3 text-right">Asaun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.client_report_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#0B1F3A]">
                        {getCategoryLabel(rep.category)}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {rep.client_report_id}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">
                        {rep.administrative_post}
                      </div>
                      <div className="text-xs text-slate-500">
                        Suku {rep.suco} {rep.aldeia ? `(${rep.aldeia})` : ''}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          rep.priority === 'CRITICAL'
                            ? 'emergency'
                            : rep.priority === 'HIGH'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {t(`prio_${rep.priority}`)}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5">
                      {rep.sync_status === 'SERVER_ACKNOWLEDGED' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{lang === 'tet' ? 'Simu husi Servidor' : 'Server Ack'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
                          <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                          <span>{lang === 'tet' ? 'Rai iha Aparellu (Lokal)' : 'Device Local Only'}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          rep.verification_status === 'VERIFIED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rep.verification_status === 'VERIFIED'
                          ? t('verified')
                          : t('unverified')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link to={`/reports/${rep.client_report_id}`}>
                        <Button variant="secondary" size="sm" icon={ChevronRight}>
                          {lang === 'tet' ? 'Detallu' : 'Details'}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ReportsList;
