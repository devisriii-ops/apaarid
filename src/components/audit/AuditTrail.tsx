import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  ShieldCheck,
  User,
  Building,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AuditEvent } from '../../types';
import { appStore } from '../../services/store';

export const AuditTrail: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>(appStore.getAuditEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const actionTypes = [
    'STUDENT_CREATED',
    'STUDENT_UPDATED',
    'STUDENT_CORRECTED',
    'STUDENT_ARCHIVED',
    'BATCH_IMPORTED',
    'VALIDATION_RESOLVED',
    'DUPLICATE_DECIDED',
    'PROGRAMME_CREATED',
    'REPORT_EXPORTED',
    'MEMBERSHIP_UPDATED',
    'CLAIM_SUBMITTED',
    'CLAIM_APPROVED',
    'VERIFICATION_CHECK_EXECUTED'
  ];

  const filtered = events.filter((e) => {
    if (selectedAction !== 'ALL' && e.actionType !== selectedAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.summary.toLowerCase().includes(q) ||
        e.actorName.toLowerCase().includes(q) ||
        e.actorEmail.toLowerCase().includes(q) ||
        e.actionType.toLowerCase().includes(q) ||
        e.entityId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Immutable Cryptographic Operations Ledger
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Institutional Audit Trail
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Tamper-evident record of all student creation, corrections, batch uploads, duplicate resolutions, and export actions.
          </p>
        </div>

        <div className="text-xs font-mono text-[#B8D8C2] px-3 py-1 bg-[#0B1812] border border-[#123D2A] rounded-lg">
          {events.length} Audit Events Logged
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9BAAA0] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actor, action type, student entity ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
          />
        </div>

        <div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
          >
            <option value="ALL">All Action Types</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0B1812] border border-[#123D2A] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#9BAAA0]">
            No matching audit events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#123D2A] bg-[#07110D]/60 text-[#9BAAA0]">
                  <th className="py-3 px-4 font-medium">Timestamp (UTC)</th>
                  <th className="py-3 px-4 font-medium">Actor & Role</th>
                  <th className="py-3 px-4 font-medium">Action Type</th>
                  <th className="py-3 px-4 font-medium">Entity Reference</th>
                  <th className="py-3 px-4 font-medium">Operation Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123D2A]/50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#123D2A]/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#9BAAA0] whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#F2F6F0]">{item.actorName}</div>
                      <div className="text-[10px] text-[#9BAAA0] font-mono">
                        {item.actorEmail} ({item.actorRole.replace(/_/g, ' ')})
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#123D2A] text-[#B8D8C2] border border-[#1D6B48]/50">
                        {item.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#C8AA6E] whitespace-nowrap">
                      {item.entityType}:{item.entityId.slice(-8)}
                    </td>
                    <td className="py-3 px-4 text-[#F2F6F0] leading-snug">
                      {item.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
