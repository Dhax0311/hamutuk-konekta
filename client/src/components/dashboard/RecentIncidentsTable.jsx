import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Layers, 
  X, 
  Send,
  Eye,
  ShieldCheck,
  User
} from 'lucide-react';

export default function RecentIncidentsTable({
  incidents = [],
  communityNeeds = [],
  onInspectOnMap
}) {
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'needs'
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tab Switcher Header */}
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'incidents'
              ? 'border-brand-navy text-brand-navy bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertTriangle size={15} className={activeTab === 'incidents' ? 'text-brand-red' : 'text-gray-400'} />
          <span>Recent Incident Reports</span>
          <span className="bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
            {incidents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('needs')}
          className={`flex items-center space-x-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'needs'
              ? 'border-brand-navy text-brand-navy bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <HelpCircle size={15} className={activeTab === 'needs' ? 'text-blue-600' : 'text-gray-400'} />
          <span>Community Needs Awaiting Follow-Up</span>
          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
            {communityNeeds.length}
          </span>
        </button>
      </div>

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Administrative Location</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Reported</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No incident reports match current filter criteria.
                  </td>
                </tr>
              ) : (
                incidents.map(report => (
                  <tr key={report.client_id || report.id} className="hover:bg-gray-50 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {report.client_id}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 font-medium text-gray-800">
                        <span>{report.type === 'FLOOD' ? '🌊' : report.type === 'LANDSLIDE' ? '⛰️' : report.type === 'MEDICAL' ? '🏥' : '⚠️'}</span>
                        <span>{report.type}</span>
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        report.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        report.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {report.severity}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-gray-700">
                      <div>
                        {report.suco ? `${report.suco}, ` : ''}{report.municipality || 'Viqueque'}
                      </div>
                      {report.isApproximateOnly && (
                        <span className="text-[10px] text-amber-700 font-medium">
                          ⚠️ Approx Centroid
                        </span>
                      )}
                    </td>

                    {/* Verification */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        report.verification_status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {report.verification_status === 'VERIFIED' ? 'VERIFIED' : 'ACTION REQ'}
                      </span>
                    </td>

                    {/* Origin */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        report.origin === 'LOCAL_PENDING' ? 'bg-amber-100 text-amber-800' :
                        report.origin === 'SERVER_ACKNOWLEDGED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {report.sourceLabel}
                      </span>
                    </td>

                    {/* Reported */}
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(report.reported_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedItem(report)}
                        className="px-2 py-1 text-gray-600 hover:text-brand-navy hover:bg-gray-100 rounded text-xs font-medium"
                        title="View Report Details"
                      >
                        <Eye size={14} className="inline" />
                      </button>
                      {report.latitude && report.longitude && (
                        <button
                          onClick={() => onInspectOnMap && onInspectOnMap(report)}
                          className="px-2 py-1 text-brand-navy hover:bg-blue-50 rounded text-xs font-bold"
                          title="View on Map"
                        >
                          <MapPin size={14} className="inline mr-1" />
                          <span>Map</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Needs Tab */}
      {activeTab === 'needs' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Need ID</th>
                <th className="py-3 px-4">Related Report</th>
                <th className="py-3 px-4">Primary Resource</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Requested Quantity / Description</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Follow-Up Status</th>
                <th className="py-3 px-4">Contact Person</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {communityNeeds.map(need => (
                <tr key={need.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">
                    {need.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-600">
                    {need.emergency_report_id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-brand-navy">{need.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      need.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      need.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {need.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {need.quantity}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {need.suco}, {need.municipality}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      need.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {need.status === 'DISPATCHED' ? 'DISPATCHED' : 'AWAITING RESPONSE'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {need.contact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-brand-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={20} className="text-amber-400" />
                <h3 className="font-bold text-base">Incident Report Summary</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="text-gray-300 hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Report Identifier</span>
                  <span className="font-mono font-bold text-base text-gray-900">{selectedItem.client_id}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  selectedItem.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  selectedItem.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedItem.severity}
                </span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Incident Title</span>
                <p className="font-bold text-sm text-gray-900">{selectedItem.title || selectedItem.type}</p>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Detailed Field Description</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Location</span>
                  <span className="font-medium text-gray-800">
                    {selectedItem.suco ? `${selectedItem.suco}, ` : ''}{selectedItem.posto ? `${selectedItem.posto}, ` : ''}{selectedItem.municipality}
                  </span>
                  {selectedItem.isApproximateOnly && (
                    <span className="block text-[10px] text-amber-700 mt-0.5">⚠️ Approximate Centroid</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Reported By</span>
                  <span className="font-medium text-gray-800">{selectedItem.reporter_name || 'Community Member'}</span>
                  <span className="block text-[10px] text-gray-500">Role: {selectedItem.reporter_role || 'Field Reporter'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t text-gray-500 text-[11px]">
                <span>Origin: <strong>{selectedItem.sourceLabel}</strong></span>
                <span>Time: {new Date(selectedItem.reported_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              {selectedItem.latitude && selectedItem.longitude && (
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    if (onInspectOnMap) onInspectOnMap(item);
                  }}
                  className="px-4 py-2 bg-brand-navy text-white rounded-lg text-xs font-bold hover:bg-opacity-90 flex items-center space-x-1"
                >
                  <MapPin size={14} />
                  <span>Locate on Map</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
