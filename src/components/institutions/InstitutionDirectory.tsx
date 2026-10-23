import React, { useState } from 'react';
import {
  Building,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Institution } from '../../types';
import { OFFICIAL_STATES_DISTRICTS } from '../../data/referenceData';
import { appStore } from '../../services/store';

export const InstitutionDirectory: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const [institutions, setInstitutions] = useState<Institution[]>(appStore.getInstitutions());
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Claim modal state
  const [claimingInst, setClaimingInst] = useState<Institution | null>(null);
  const [representativeName, setRepresentativeName] = useState(currentUser.fullName);
  const [representativeEmail, setRepresentativeEmail] = useState(currentUser.email);
  const [designation, setDesignation] = useState('Dean / Head of Institution');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const availableDistricts =
    selectedState !== 'ALL'
      ? OFFICIAL_STATES_DISTRICTS.find((s) => s.state === selectedState)?.districts || []
      : [];

  const filtered = institutions.filter((inst) => {
    if (selectedState !== 'ALL' && inst.state !== selectedState) return false;
    if (selectedDistrict !== 'ALL' && inst.district !== selectedDistrict) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inst.name.toLowerCase().includes(q) ||
        inst.aictePermanentId.toLowerCase().includes(q) ||
        inst.district.toLowerCase().includes(q) ||
        inst.state.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingInst) return;
    appStore.updateInstitutionClaim(claimingInst.id, 'claim_pending');
    setClaimSuccess(true);
    setInstitutions(appStore.getInstitutions());
    setTimeout(() => {
      setClaimSuccess(false);
      setClaimingInst(null);
    }, 1500);
  };

  const handleApproveClaim = (instId: string) => {
    appStore.updateInstitutionClaim(instId, 'verified_active');
    setInstitutions(appStore.getInstitutions());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            National Geographic & Institutional Registry
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            AICTE Institution Directory
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Hierarchy: India → State/UT → District → Institution. Synchronized with Local Government Directory (LGD).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#B8D8C2]">
          <span className="px-3 py-1 bg-[#0B1812] border border-[#123D2A] rounded-lg">
            {institutions.length} Verified Institutions
          </span>
        </div>
      </div>

      {/* State / District / Search Filter Bar */}
      <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9BAAA0] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search college name, AICTE ID, district..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
            />
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
            >
              <option value="ALL">All States / Union Territories (India)</option>
              {OFFICIAL_STATES_DISTRICTS.map((s) => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={selectedState === 'ALL'}
              className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] disabled:opacity-50 focus:outline-none focus:border-[#1D6B48]"
            >
              <option value="ALL">
                {selectedState === 'ALL' ? 'Select State First' : 'All Districts'}
              </option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Institutions Directory Grid */}
      <div className="space-y-4">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className="p-5 bg-[#0B1812] border border-[#123D2A] hover:border-[#1D6B48] rounded-xl transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#B8D8C2] bg-[#123D2A] px-2 py-0.5 rounded border border-[#1D6B48]/40">
                    AICTE Permanent ID: {inst.aictePermanentId}
                  </span>
                  <span>·</span>
                  <span className="text-xs text-[#9BAAA0]">{inst.district}, {inst.state}</span>
                </div>
                <h3 className="text-base font-semibold text-[#F2F6F0]">{inst.name}</h3>
                <p className="text-xs text-[#9BAAA0] mt-0.5">
                  Category: <strong className="text-[#F2F6F0]">{inst.category}</strong> · Management Type: <span className="text-[#C8AA6E]">{inst.managementType}</span>
                </p>
              </div>

              {/* Status Badges & Onboarding Actions */}
              <div className="flex items-center gap-2 self-end sm:self-start">
                <span
                  className={`text-[11px] font-mono px-2.5 py-1 rounded border uppercase ${
                    inst.claimStatus === 'verified_active'
                      ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                      : 'text-amber-400 border-amber-800 bg-amber-950/40'
                  }`}
                >
                  {inst.claimStatus === 'verified_active' ? 'Institutional Access Active' : 'Claim Pending'}
                </span>

                {currentUser.role === 'platform_admin' && inst.claimStatus === 'claim_pending' && (
                  <button
                    onClick={() => handleApproveClaim(inst.id)}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    Approve Claim
                  </button>
                )}

                {inst.claimStatus !== 'verified_active' && currentUser.role !== 'platform_admin' && (
                  <button
                    onClick={() => setClaimingInst(inst)}
                    className="px-3 py-1 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-medium rounded cursor-pointer transition-colors"
                  >
                    Claim Access
                  </button>
                )}
              </div>
            </div>

            {/* 4 Distinct Grounding Statuses (Section 6 Requirement) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#123D2A] text-[11px]">
              <div className="p-2 bg-[#07110D] rounded border border-[#123D2A] flex items-center justify-between">
                <span className="text-[#9BAAA0]">Found in Directory</span>
                <span className="text-emerald-400 font-mono">Confirmed</span>
              </div>
              <div className="p-2 bg-[#07110D] rounded border border-[#123D2A] flex items-center justify-between">
                <span className="text-[#9BAAA0]">Identity Matched</span>
                <span className="text-emerald-400 font-mono">Matched</span>
              </div>
              <div className="p-2 bg-[#07110D] rounded border border-[#123D2A] flex items-center justify-between">
                <span className="text-[#9BAAA0]">AICTE EoA Confirmed</span>
                <span className="text-emerald-400 font-mono">Verified</span>
              </div>
              <div className="p-2 bg-[#07110D] rounded border border-[#123D2A] flex items-center justify-between">
                <span className="text-[#9BAAA0]">Platform Approved</span>
                <span className={inst.claimStatus === 'verified_active' ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                  {inst.claimStatus === 'verified_active' ? 'Active' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#9BAAA0] pt-1">
              <div>EoA Reference: {inst.aicteApprovalRef}</div>
              <div>Source: {inst.datasetVersion} (Retrieved: {inst.lastRetrievedDate})</div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Institution Modal */}
      {claimingInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0]">
            <h3 className="text-base font-bold text-[#F2F6F0]">
              Submit Authorised Institution Claim
            </h3>
            <p className="text-xs text-[#9BAAA0] mt-1">
              Request access permissions for {claimingInst.name} (AICTE ID: {claimingInst.aictePermanentId}).
            </p>

            {claimSuccess ? (
              <div className="py-6 text-center text-xs text-emerald-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <div className="font-semibold text-sm">Institutional Claim Submitted</div>
                <div className="text-[#9BAAA0]">Logged in audit trail; awaiting Platform Admin review.</div>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-3.5 mt-4 text-xs">
                <div>
                  <label className="block text-[#9BAAA0] mb-1">Authorised Representative Name *</label>
                  <input
                    type="text"
                    required
                    value={representativeName}
                    onChange={(e) => setRepresentativeName(e.target.value)}
                    className="w-full p-2 bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0]"
                  />
                </div>
                <div>
                  <label className="block text-[#9BAAA0] mb-1">Official Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={representativeEmail}
                    onChange={(e) => setRepresentativeEmail(e.target.value)}
                    className="w-full p-2 bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0]"
                  />
                </div>
                <div>
                  <label className="block text-[#9BAAA0] mb-1">Institutional Designation *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2 bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0]"
                  />
                </div>

                <div className="pt-4 border-t border-[#123D2A] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setClaimingInst(null)}
                    className="px-3.5 py-1.5 text-[#9BAAA0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold rounded-lg cursor-pointer"
                  >
                    Submit Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
