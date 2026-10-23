import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  MessageSquare,
  ShieldCheck,
  Eye,
  ArrowRight
} from 'lucide-react';
import { ValidationFinding } from '../../types';
import { appStore } from '../../services/store';

export const ValidationFindings: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const [findings, setFindings] = useState<ValidationFinding[]>(appStore.getValidationFindings());
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved' | 'dismissed'>('open');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution modal state
  const [selectedFinding, setSelectedFinding] = useState<ValidationFinding | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'resolve' | 'dismiss'>('resolve');
  const [resolutionNote, setResolutionNote] = useState('');

  const refreshFindings = () => {
    setFindings(appStore.getValidationFindings());
  };

  const handleApplyResolution = () => {
    if (!selectedFinding) return;
    if (resolutionAction === 'resolve') {
      appStore.resolveFinding(selectedFinding.id, resolutionNote || 'Verified and rectified by administrator.');
    } else {
      appStore.dismissFinding(selectedFinding.id, resolutionNote || 'Dismissed as false positive or non-blocking deviation.');
    }
    setSelectedFinding(null);
    setResolutionNote('');
    refreshFindings();
  };

  const filtered = findings.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        f.studentName.toLowerCase().includes(q) ||
        f.issueCategory.toLowerCase().includes(q) ||
        f.apaarMasked.includes(q) ||
        f.id.toLowerCase().includes(q);
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
            Automated Rules & Compliance Engine
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Validation Findings & Anomaly Log
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Deterministic rule exceptions flagging malformed identifiers, intake overflow, or academic inconsistencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 bg-[#0B1812] border border-[#123D2A] rounded-lg text-[#B8D8C2]">
            {findings.filter((f) => f.status === 'open').length} Open Exceptions
          </span>
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
            placeholder="Search finding ID, student name, rule..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Only</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
          >
            <option value="all">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 px-4 bg-[#0B1812] border border-[#123D2A] rounded-xl text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#F2F6F0]">No Validation Findings Found</h4>
            <p className="text-xs text-[#9BAAA0] mt-1 max-w-sm mx-auto">
              All submitted student records in this view adhere strictly to 12-digit APAAR structure and intake constraints.
            </p>
          </div>
        ) : (
          filtered.map((finding) => (
            <div
              key={finding.id}
              className={`p-4 bg-[#0B1812] border rounded-xl transition-all ${
                finding.status === 'open'
                  ? 'border-[#123D2A] hover:border-[#1D6B48]'
                  : 'border-[#123D2A]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] text-[#B8D8C2]">{finding.id}</span>
                    <span>·</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
                        finding.severity === 'high'
                          ? 'text-red-400 border-red-800 bg-red-950/40'
                          : finding.severity === 'medium'
                          ? 'text-amber-400 border-amber-800 bg-amber-950/40'
                          : 'text-[#B8D8C2] border-[#1D6B48] bg-[#123D2A]/60'
                      }`}
                    >
                      {finding.severity} Severity
                    </span>
                    <span>·</span>
                    <span className="text-xs font-semibold text-[#F2F6F0]">{finding.issueCategory}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#F2F6F0]">
                    {finding.studentName} ({finding.apaarMasked})
                  </h4>

                  <p className="text-xs text-[#9BAAA0] mt-1 leading-relaxed">
                    <strong className="text-[#F2F6F0]">Rule Explanation:</strong> {finding.explanation}
                  </p>

                  <div className="mt-2 p-2 bg-[#07110D] border border-[#123D2A] rounded text-[11px] font-mono text-[#9BAAA0]">
                    <strong className="text-[#B8D8C2]">Evidence:</strong> {finding.evidence}
                  </div>

                  {finding.resolutionNotes && (
                    <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                      Resolution: {finding.resolutionNotes} (by {finding.resolvedBy})
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  {finding.status === 'open' && currentUser.role !== 'student' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedFinding(finding);
                          setResolutionAction('resolve');
                        }}
                        className="px-3 py-1.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-medium rounded-lg cursor-pointer transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFinding(finding);
                          setResolutionAction('dismiss');
                        }}
                        className="px-3 py-1.5 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-[#9BAAA0] hover:text-[#F2F6F0] text-xs rounded-lg cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {finding.status !== 'open' && (
                    <span className="text-[11px] font-mono text-emerald-400 capitalize">
                      {finding.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0]">
            <h3 className="text-base font-bold text-[#F2F6F0]">
              {resolutionAction === 'resolve' ? 'Resolve Validation Finding' : 'Dismiss Validation Finding'}
            </h3>
            <p className="text-xs text-[#9BAAA0] mt-1">
              Document your decision for the institutional audit trail ({selectedFinding.id}).
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Resolution Note / Justification *
              </label>
              <textarea
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="e.g. Correct marksheet uploaded; verified against State CET allocation."
                className="w-full p-2.5 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div className="mt-5 pt-3 border-t border-[#123D2A] flex justify-end gap-2">
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-3 py-1.5 text-xs text-[#9BAAA0]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyResolution}
                className="px-4 py-1.5 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg cursor-pointer"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
