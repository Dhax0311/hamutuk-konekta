import React, { useState, useEffect } from 'react';
import {
  HelpingHand,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Check
} from 'lucide-react';
import db from '../lib/offline/db';
import { DEMO_ADMINISTRATIVE_AREAS } from '../lib/mockData';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export function CommunityNeeds() {
  const { t, lang } = useLanguage();
  const [needs, setNeeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New need form state
  const [newCat, setNewCat] = useState('water');
  const [newLoc, setNewLoc] = useState('Uato-Lari, Macadique');
  const [newQty, setNewQty] = useState('');
  const [newUrgency, setNewUrgency] = useState('HIGH');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    async function loadNeeds() {
      try {
        const items = await db.needs.reverse().toArray();
        setNeeds(items);
      } catch (err) {
        console.error('Error fetching needs:', err);
      }
    }
    loadNeeds();
  }, []);

  const handleCreateNeed = async (e) => {
    e.preventDefault();
    if (!newQty.trim()) return;

    const newObj = {
      id: `need-${Date.now().toString().slice(-4)}`,
      category: newCat,
      location: newLoc,
      quantity: newQty,
      urgency: newUrgency,
      status: 'PENDING',
      notes: newNotes,
      created_at: new Date().toISOString(),
      is_demo: true
    };

    try {
      await db.needs.add(newObj);
      setNeeds((prev) => [newObj, ...prev]);
      setIsModalOpen(false);
      setNewQty('');
      setNewNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await db.needs.update(id, { status: newStatus });
      setNeeds((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNeeds = needs.filter((n) => {
    const matchesSearch =
      n.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.quantity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = filterCategory === 'ALL' || n.category === filterCategory;
    const matchesUrg = filterUrgency === 'ALL' || n.urgency === filterUrgency;

    return matchesSearch && matchesCat && matchesUrg;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              {t('navNeeds')}
            </h1>
            <Badge variant="demo">DEMO DATA</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Rejistu no koordinasaun nesesidade báziku (be\'e, ai-han, lona, ai-moruk no transporte).'
              : 'Record and coordinate basic community needs during disaster response.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => setIsModalOpen(true)}
        >
          {lang === 'tet' ? 'Rejista Nesesidade Foun' : 'Record New Need'}
        </Button>
      </div>

      {/* Coordination note banner */}
      <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          {lang === 'tet'
            ? 'Sistema ne\'e funsiona hodi rejista no koordena informasaun apoiu umanitáriu munisípiu, la\'os haruka materiál automatikamente.'
            : 'This module records and coordinates information to assist response coordinators; it does not automatically dispatch supplies.'}
        </span>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'tet' ? 'Buka tuir fatin ka nesesidade...' : 'Search location or need...'}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="ALL">{lang === 'tet' ? 'Kategoria: Hotu' : 'Category: All'}</option>
            <option value="water">{lang === 'tet' ? "Be'e Moos" : 'Clean Water'}</option>
            <option value="food">{lang === 'tet' ? 'Ai-han' : 'Food'}</option>
            <option value="shelter">{lang === 'tet' ? 'Lona / Abrigu' : 'Shelter'}</option>
            <option value="medicine">{lang === 'tet' ? 'Ai-moruk' : 'Medical'}</option>
            <option value="transport">{lang === 'tet' ? 'Transporte' : 'Transport'}</option>
          </select>

          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="px-2.5 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="ALL">{lang === 'tet' ? 'Urxénsia: Hotu' : 'Urgency: All'}</option>
            <option value="CRITICAL">{t('prio_CRITICAL')}</option>
            <option value="HIGH">{t('prio_HIGH')}</option>
            <option value="MEDIUM">{t('prio_MEDIUM')}</option>
            <option value="LOW">{t('prio_LOW')}</option>
          </select>
        </div>
      </Card>

      {/* Needs Grid */}
      {filteredNeeds.length === 0 ? (
        <Card>
          <EmptyState
            title={lang === 'tet' ? 'La iha nesesidade' : 'No community needs recorded'}
            description={lang === 'tet' ? 'La hetan dadus tuir filtru ne\'e.' : 'No items match your query.'}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNeeds.map((need) => (
            <Card key={need.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {need.id}
                    </span>
                    <h3 className="text-base font-bold text-[#0B1F3A] mt-1.5">{need.quantity}</h3>
                  </div>

                  <Badge
                    variant={
                      need.urgency === 'CRITICAL'
                        ? 'emergency'
                        : need.urgency === 'HIGH'
                        ? 'warning'
                        : 'default'
                    }
                    size="sm"
                  >
                    {need.urgency}
                  </Badge>
                </div>

                <p className="text-xs font-semibold text-slate-700 mt-2">
                  📍 {need.location}
                </p>

                {need.notes && (
                  <p className="text-xs text-[#64748B] mt-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {need.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {lang === 'tet' ? 'Status:' : 'Status:'}{' '}
                  <span className="font-mono text-blue-700">{need.status}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {need.status !== 'RESOLVED' ? (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(need.id, 'RESOLVED')}
                      className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 cursor-pointer"
                    >
                      ✓ {lang === 'tet' ? 'Finaliza' : 'Resolve'}
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lang === 'tet' ? 'Atende ona' : 'Resolved'}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal to add new need */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={lang === 'tet' ? 'Rejista Nesesidade Komunidade Foun' : 'Record Community Need'}
      >
        <form onSubmit={handleCreateNeed} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'tet' ? 'Kategoria Apoiu' : 'Support Category'} *
            </label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="water">{lang === 'tet' ? "Be'e Moos" : 'Clean Water'}</option>
              <option value="food">{lang === 'tet' ? 'Ai-han' : 'Food'}</option>
              <option value="shelter">{lang === 'tet' ? 'Lona / Abrigu' : 'Shelter'}</option>
              <option value="medicine">{lang === 'tet' ? 'Ai-moruk' : 'Medical'}</option>
              <option value="transport">{lang === 'tet' ? 'Transporte' : 'Transport'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'tet' ? 'Kuantidade / Artigu' : 'Quantity / Description'} *
            </label>
            <input
              type="text"
              required
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              placeholder="ex: 1,500 Litros be'e moos"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'tet' ? 'Fatin (Postu, Suku, Aldeia)' : 'Location'} *
            </label>
            <input
              type="text"
              required
              value={newLoc}
              onChange={(e) => setNewLoc(e.target.value)}
              placeholder="ex: Uato-Lari, Macadique (Namanei)"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'tet' ? 'Nivel Urxénsia' : 'Urgency Level'}
            </label>
            <select
              value={newUrgency}
              onChange={(e) => setNewUrgency(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="CRITICAL">{t('prio_CRITICAL')}</option>
              <option value="HIGH">{t('prio_HIGH')}</option>
              <option value="MEDIUM">{t('prio_MEDIUM')}</option>
              <option value="LOW">{t('prio_LOW')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'tet' ? 'Nota Adisionál' : 'Additional Notes'}
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="ex: Mota sa'e estraga ponti be'e nian..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              {t('cancelBtn')}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {lang === 'tet' ? 'Rai Nesesidade' : 'Save Need'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CommunityNeeds;
