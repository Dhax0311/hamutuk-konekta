import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import { useAuth } from '../features/context/AuthContext';
import { useLanguage } from '../features/context/LanguageContext';
import { useNetwork } from '../features/context/NetworkContext';
import api from '../lib/api/client';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

export function UserManagement() {
  const { user, isAdmin } = useAuth();
  const { isOnline } = useNetwork();
  const { t, lang } = useLanguage();

  const [usersList, setUsersList] = useState([
    {
      id: 'usr-admin-1',
      name: 'HAMUTUK Administrator',
      email: 'admin@hamutuk.local',
      role: 'ADMIN',
      area: 'Munisípiu Viqueque (Sentrál)',
      phone: '+670 7723 4567',
      enabled: true
    },
    {
      id: 'usr-suco-1',
      name: 'Mateus da Costa',
      email: 'mateus.suco@hamutuk.local',
      role: 'SUCO_OFFICER',
      area: 'Postu Uato-Lari, Suku Macadique',
      phone: '+670 7789 1234',
      enabled: true
    },
    {
      id: 'usr-coord-1',
      name: 'Helena Pinto Soares',
      email: 'helena.coord@hamutuk.local',
      role: 'MUNICIPAL_COORDINATOR',
      area: 'Munisípiu Viqueque',
      phone: '+670 7812 9988',
      enabled: true
    },
    {
      id: 'usr-suco-2',
      name: 'António dos Santos',
      email: 'antonio.suco@hamutuk.local',
      role: 'SUCO_OFFICER',
      area: 'Postu Lacluta, Suku Dilor',
      phone: '+670 7765 4321',
      enabled: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [role, setRole] = useState('SUCO_OFFICER');
  const [area, setArea] = useState('Postu Ossu, Suku Liaruca');
  const [phone, setPhone] = useState('+670 77');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchServerUsers() {
      if (isOnline) {
        try {
          const res = await api.getUsers();
          if (res.data?.users && res.data.users.length > 0) {
            setUsersList(
              res.data.users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                area: u.administrative_area || 'Munisípiu Viqueque',
                phone: u.phone || '-',
                enabled: !!u.is_active
              }))
            );
          }
        } catch {
          // Graceful fallback to demo state
        }
      }
    }
    fetchServerUsers();
  }, [isOnline]);

  const handleToggleUser = (id) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u))
    );
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSaving(true);
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name,
      email,
      password,
      role,
      administrative_area: area,
      phone,
      enabled: true
    };

    try {
      if (isOnline) {
        await api.createUser({
          name,
          email,
          password,
          role,
          administrative_area: area,
          phone
        });
      }
      setUsersList((prev) => [...prev, newUser]);
      setIsModalOpen(false);
      setName('');
      setEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Erru kria utilizador.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              {t('navUsers')}
            </h1>
            <Badge variant="emergency">ADMIN ONLY</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Jestaun konta ofisiál suku no kordenadór. La iha auto-rejistu públiku iha sistema protejidu ne\'e.'
              : 'Authorized account management. No public self-registration is allowed in this operational prototype.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={UserPlus}
          onClick={() => setIsModalOpen(true)}
        >
          {lang === 'tet' ? 'Kria Konta Foun' : 'Create Staff Account'}
        </Button>
      </div>

      {/* Security alert */}
      <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-700 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <span>
          {lang === 'tet'
            ? 'Konta sira kria de\'it husi Administradór. Ofisiál suku iha aksesu de\'it ba rejistu relatóriu no nesesidade lokál.'
            : 'All credentials are Administrator-provisioned. Suco officers have scoped permissions for local incident reporting.'}
        </span>
      </div>

      {/* Users table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Utilizador &amp; Email</th>
                <th className="px-4 py-3">Kargu / Papél</th>
                <th className="px-4 py-3">Área Responsabilidade</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Asaun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-[#0B1F3A]">{u.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : u.role === 'MUNICIPAL_COORDINATOR'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-xs text-slate-700">
                    {u.area}
                  </td>

                  <td className="px-4 py-3.5 text-xs font-mono text-slate-600">
                    {u.phone}
                  </td>

                  <td className="px-4 py-3.5">
                    {u.enabled ? (
                      <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lang === 'tet' ? 'Ativu' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-rose-600 text-xs font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        {lang === 'tet' ? 'Desativu' : 'Disabled'}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleUser(u.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      {u.enabled
                        ? (lang === 'tet' ? 'Desativa' : 'Disable')
                        : (lang === 'tet' ? 'Ativa' : 'Enable')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal to create staff account */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={lang === 'tet' ? 'Kria Konta Ofisiál Foun' : 'Create Authorized Account'}
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Naran Kompletu *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Zulmira Ximenes"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Ofisiál *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="zulmira.suco@hamutuk.local"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password Inisiál *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kargu / Papél *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="SUCO_OFFICER">Ofisiál Suku (Suco Officer)</option>
              <option value="MUNICIPAL_COORDINATOR">Kordenadór Munisípiu (Coordinator)</option>
              <option value="ADMIN">Administradór Sentrál (Admin)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Área Responsabilidade
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="ex: Postu Uato-Carbau, Suku Irabin"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nu. Telemóvel
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              {t('cancelBtn')}
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              {lang === 'tet' ? 'Rai Utilizador' : 'Save Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserManagement;
