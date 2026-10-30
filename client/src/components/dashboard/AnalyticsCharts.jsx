import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Activity, PieChart as PieIcon, BarChart3, MapPin } from 'lucide-react';
import { VIQUEQUE_POSTOS } from '../../data/timorLesteLocations';

const CATEGORY_COLORS = {
  FLOOD: '#2563EB',
  LANDSLIDE: '#EA580C',
  STRONG_WIND: '#0284C7',
  MEDICAL: '#D71920',
  FIRE: '#DC2626',
  OTHER: '#6B7280'
};

const VERIFICATION_COLORS = {
  'Verified': '#10B981',
  'Requires Verification': '#F59E0B',
  'In Progress': '#3B82F6',
  'Resolved': '#6B7280'
};

const POSTO_COLORS = {
  'Viqueque Vila': '#0B1F3A',
  'Ossu': '#2563EB',
  'Uato-Lari': '#0284C7',
  'Uatucarbau': '#F59E0B',
  'Lacluta': '#10B981'
};

export default function AnalyticsCharts({ incidents = [] }) {
  // 1. Process Incident Trend over Time (7-Day Chronological Trend)
  const trendData = React.useMemo(() => {
    const daysMap = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    // Initialize 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const key = `${dayNames[d.getDay()]} ${d.getDate()}`;
      daysMap[key] = { name: key, total: 0, verified: 0, critical: 0, rawDate: d };
    }

    incidents.forEach(r => {
      const d = new Date(r.reported_at || r.created_at || Date.now());
      const key = `${dayNames[d.getDay()]} ${d.getDate()}`;
      if (daysMap[key]) {
        daysMap[key].total += 1;
        if (r.verification_status === 'VERIFIED') daysMap[key].verified += 1;
        if (r.severity === 'CRITICAL') daysMap[key].critical += 1;
      }
    });

    return Object.values(daysMap);
  }, [incidents]);

  // 2. Process Verification & Follow-up Distribution
  const verificationData = React.useMemo(() => {
    let verified = 0;
    let needsVerif = 0;
    let inProgress = 0;
    let resolved = 0;

    incidents.forEach(r => {
      if (r.status === 'RESOLVED') resolved++;
      else if (r.status === 'IN_PROGRESS') inProgress++;
      else if (r.verification_status === 'VERIFIED') verified++;
      else needsVerif++;
    });

    const items = [
      { name: 'Verified', value: verified, color: VERIFICATION_COLORS['Verified'] },
      { name: 'Requires Verification', value: needsVerif, color: VERIFICATION_COLORS['Requires Verification'] },
      { name: 'In Progress', value: inProgress, color: VERIFICATION_COLORS['In Progress'] },
      { name: 'Resolved', value: resolved, color: VERIFICATION_COLORS['Resolved'] }
    ].filter(item => item.value > 0);

    return items.length > 0 ? items : [{ name: 'Requires Verification', value: incidents.length || 1, color: '#F59E0B' }];
  }, [incidents]);

  // 3. Process Incident Categories
  const categoryData = React.useMemo(() => {
    const counts = {};
    incidents.forEach(r => {
      const type = (r.type || r.category || 'OTHER').toUpperCase();
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      color: CATEGORY_COLORS[name] || '#6B7280'
    })).sort((a, b) => b.count - a.count);
  }, [incidents]);

  // 4. Process Reports by Postu Administrativu (Municipio Viqueque: 5 Postus)
  const postoData = React.useMemo(() => {
    const counts = {};
    // Ensure all 5 postus are pre-initialized so all are visible
    VIQUEQUE_POSTOS.forEach(p => {
      counts[p.name] = 0;
    });

    incidents.forEach(r => {
      const posto = r.posto || r.administrative_post;
      if (posto) {
        // match case-insensitively
        const match = VIQUEQUE_POSTOS.find(p => p.name.toLowerCase() === posto.toLowerCase());
        if (match) {
          counts[match.name] = (counts[match.name] || 0) + 1;
        } else {
          counts[posto] = (counts[posto] || 0) + 1;
        }
      } else {
        counts['Viqueque Vila'] = (counts['Viqueque Vila'] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([posto, count]) => ({
      posto,
      count,
      color: POSTO_COLORS[posto] || '#0B1F3A'
    })).sort((a, b) => b.count - a.count);
  }, [incidents]);

  return (
    <div className="space-y-6">
      {/* Charts Grid Row 1: Trend Line & Verification Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-50 text-[#0B1F3A] rounded-lg">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Incident Reports Over Time (7-Day Trend)</h3>
                <p className="text-xs text-gray-500">Chronological incident frequency and verification progression in Viqueque</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-[#0B1F3A] border border-blue-200 px-2 py-0.5 rounded font-bold">
              VIQUEQUE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1F3A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Total Reports" 
                  stroke="#0B1F3A" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="verified" 
                  name="Verified Reports" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVerified)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="critical" 
                  name="Critical Emergencies" 
                  stroke="#D71920" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#D71920' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Status Donut Chart (1 col) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <PieIcon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Report Verification Status</h3>
                  <p className="text-xs text-gray-500">Triage & resolution progress</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
                PILOT
              </span>
            </div>

            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {verificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1F3A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-[#0B1F3A]">{incidents.length}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-gray-100 mt-2">
            {verificationData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600 truncate">{item.name}:</span>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Categories Bar Chart & Reports by Postu Administrativu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Categories Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-red-50 text-[#D71920] rounded-lg">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Reports by Incident Category</h3>
                <p className="text-xs text-gray-500">Distribution across active disaster classifications</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
              CLASSIFICATION
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#6B7280" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1F3A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="count" name="Reports" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports by Postu Administrativu (Viqueque 5 Postus) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Reports by Postu Administrativu</h3>
                <p className="text-xs text-gray-500">Distribuisaun insidente iha 5 Postu Munisípiu Viqueque</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              5 POSTUS
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={postoData} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis 
                  dataKey="posto" 
                  type="category" 
                  tick={{ fontSize: 11, fontWeight: 500 }} 
                  stroke="#4B5563" 
                  width={90} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1F3A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="count" name="Reports" radius={[0, 4, 4, 0]}>
                  {postoData.map((entry, index) => (
                    <Cell key={`posto-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
