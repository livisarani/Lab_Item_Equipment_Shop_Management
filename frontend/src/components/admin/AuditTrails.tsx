import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SearchIcon, DownloadIcon, ShieldCheckIcon } from 'lucide-react';

export const AuditTrails: React.FC = () => {
  const { auditLogs } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const exportAuditCSV = () => {
    const headers = ['ID,Timestamp,User,Role,Action,Target,Type,Details'];
    const rows = filteredLogs.map(
      (l) =>
        `"${l.id}","${l.timestamp}","${l.user}","${l.userRole}","${l.action}","${l.target}","${l.type}","${l.details.replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `LISM_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            21 CFR Part 11 Traceability
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Audit Trails
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Immutable compliance log of all user actions, stock updates, and order modifications
          </p>
        </div>
        <button
          onClick={exportAuditCSV}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Audit CSV
        </button>
      </div>

      <div className="sp-card-dark p-6 sm:p-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search audit logs by user, action, target, or details..."
              className="pl-10 pr-4 py-2.5 w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#b0b0b0]" />
          </div>
          <select
            className="bg-[#000000] border border-[#2d2d2d] text-white px-4 py-2.5 rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Event Types ({auditLogs.length})</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete / Suspend</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#212121] text-sm">
            <thead className="bg-[#131313]">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Timestamp
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  User & Role
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Action
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Target Entity
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Details
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212121]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#131313]">
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-[#b0b0b0]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-white">{log.user}</div>
                    <div className="text-xs text-[#b0b0b0] capitalize">
                      {log.userRole}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-semibold text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-[#27c2d2] font-bold">
                    {log.target}
                  </td>
                  <td className="px-4 py-4 text-xs text-[#b0b0b0] max-w-md">
                    {log.details}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                        log.type === 'create'
                          ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                          : log.type === 'update'
                          ? 'bg-[#0e97b0]/30 text-[#27c2d2]'
                          : log.type === 'system'
                          ? 'bg-white/15 text-white'
                          : 'bg-[#aa4266] text-white'
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#b0b0b0]">
                    <ShieldCheckIcon className="h-8 w-8 mx-auto text-[#5d5d5d] mb-2" />
                    No audit records match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
