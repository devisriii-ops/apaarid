import React, { useState } from 'react';
import {
  GitCompare,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  XCircle,
  Key,
  Calendar,
  Building2,
  GraduationCap
} from 'lucide-react';
import { DuplicateCandidate } from '../../types';
import { appStore } from '../../services/store';

export const DuplicateReview: React.FC = () => {
  const [candidates, setCandidates] = useState<DuplicateCandidate[]>(appStore.getDuplicateCandidates());
  const [selectedCandidate, setSelectedCandidate] = useState<DuplicateCandidate | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [pendingDecision, setPendingDecision] = useState<DuplicateCandidate['status']>('confirmed_duplicate');

  const refreshCandidates = () => {
    setCandidates(appStore.getDuplicateCandidates());
  };

  const handleApplyDecision = () => {
    if (!selectedCandidate) return;
    appStore.decideDuplicate(selectedCandidate.id, pendingDecision, decisionNotes || 'Reviewed and adjudicated.');
    setSelectedCandidate(null);
    setDecisionNotes('');
    refreshCandidates();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Privacy-Preserving Identifier Integrity
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Potential Duplicate Review Workflow
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Flagged via deterministic keyed HMAC collision. Review candidates side-by-side without exposing cleartext national identifiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 bg-[#0B1812] border border-[#123D2A] rounded-lg text-[#B8D8C2]">
            {candidates.filter((c) => c.status === 'pending_review').length} Pending Decisions
          </span>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        {candidates.length === 0 ? (
          <div className="py-16 px-4 bg-[#0B1812] border border-[#123D2A] rounded-xl text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#F2F6F0]">No Duplicate Collision Candidates</h4>
            <p className="text-xs text-[#9BAAA0] mt-1 max-w-sm mx-auto">
              All stored student records have unique cryptographic HMAC signatures across this institution and batch uploads.
            </p>
          </div>
        ) : (
          candidates.map((c) => (
            <div
              key={c.id}
              className={`p-5 bg-[#0B1812] border rounded-xl transition-all ${
                c.status === 'pending_review'
                  ? 'border-amber-800/60 shadow-lg shadow-amber-950/20'
                  : 'border-[#123D2A] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#123D2A]">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#C8AA6E]" />
                  <span className="text-xs font-mono text-[#F2F6F0]">Match ID: {c.id}</span>
                  <span>·</span>
                  <span className="text-xs text-[#9BAAA0]">{c.matchType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400">
                    Match Confidence: {c.confidenceScore}%
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
                    c.status === 'pending_review'
                      ? 'text-amber-400 border-amber-800 bg-amber-950/40'
                      : 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                  }`}>
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                {/* Candidate Record A */}
                <div className="p-3.5 bg-[#07110D] border border-[#123D2A] rounded-lg space-y-1.5">
                  <div className="text-[10px] font-mono text-[#B8D8C2] uppercase">Candidate Record A (Current Submission)</div>
                  <div className="font-semibold text-sm text-[#F2F6F0]">{c.studentA.name}</div>
                  <div className="text-[#9BAAA0] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#C8AA6E]" />
                    <span className="font-mono">{c.studentA.apaarMasked}</span>
                  </div>
                  <div className="text-[#9BAAA0] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{c.studentA.programme} ({c.studentA.academicYear})</span>
                  </div>
                  <div className="text-[11px] text-[#9BAAA0]">
                    Admission Date: <strong className="font-mono text-[#F2F6F0]">{c.studentA.admissionDate}</strong>
                  </div>
                </div>

                {/* Candidate Record B */}
                <div className="p-3.5 bg-[#07110D] border border-[#123D2A] rounded-lg space-y-1.5">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">Candidate Record B (Existing Enrolment)</div>
                  <div className="font-semibold text-sm text-[#F2F6F0]">{c.studentB.name}</div>
                  <div className="text-[#9BAAA0] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#C8AA6E]" />
                    <span className="font-mono">{c.studentB.apaarMasked}</span>
                  </div>
                  <div className="text-[#9BAAA0] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{c.studentB.programme} ({c.studentB.academicYear})</span>
                  </div>
                  <div className="text-[11px] text-[#9BAAA0]">
                    Admission Date: <strong className="font-mono text-[#F2F6F0]">{c.studentB.admissionDate}</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#07110D] border border-[#123D2A] rounded text-xs text-[#9BAAA0] mb-4">
                <strong className="text-[#F2F6F0]">Algorithm Evidence:</strong> {c.matchReason}
              </div>

              {c.reviewDecision && (
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded text-xs text-emerald-300 font-mono mb-3">
                  Adjudication: {c.reviewDecision} (Decided by: {c.reviewedBy})
                </div>
              )}

              {/* Action Buttons */}
              {c.status === 'pending_review' && (
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#123D2A]">
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setPendingDecision('confirmed_duplicate');
                    }}
                    className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Confirm Duplicate Submission
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setPendingDecision('legitimate_separate');
                    }}
                    className="px-3 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Mark Legitimate Separate Enrolment
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setPendingDecision('info_requested');
                    }}
                    className="px-3 py-1.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    Request Verification Proof
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setPendingDecision('dismissed');
                    }}
                    className="px-3 py-1.5 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-[#9BAAA0] text-xs rounded-lg cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Decision Adjudication Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0]">
            <h3 className="text-base font-bold text-[#F2F6F0]">
              Adjudicate Duplicate Match ({selectedCandidate.id})
            </h3>
            <p className="text-xs text-[#9BAAA0] mt-1">
              Selected Decision:{' '}
              <span className="font-mono text-[#B8D8C2] uppercase font-semibold">
                {pendingDecision.replace(/_/g, ' ')}
              </span>
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Adjudication Justification & Evidence Reference *
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="e.g. Student transferred from previous institution with official migration certificate dated 2025-07-20."
                className="w-full p-2.5 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div className="mt-5 pt-3 border-t border-[#123D2A] flex justify-end gap-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-3 py-1.5 text-xs text-[#9BAAA0]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDecision}
                className="px-4 py-1.5 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg cursor-pointer"
              >
                Log Review Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
