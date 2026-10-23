import React from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';
import { UserProfile, StudentRecord, ValidationFinding, DuplicateCandidate, Programme } from '../../types';
import { appStore } from '../../services/store';

interface DashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const currentUser = appStore.getCurrentUser();
  const students = appStore.getStudents();
  const findings = appStore.getValidationFindings();
  const duplicates = appStore.getDuplicateCandidates();
  const programmes = appStore.getProgrammes(currentUser.institutionId);
  const auditEvents = appStore.getAuditEvents();
  const institutions = appStore.getInstitutions();
  const activeYear = appStore.getActiveAcademicYear();

  // 1. STUDENT VIEW
  if (currentUser.role === 'student') {
    const studentRecord = students[0]; // Bound to the logged-in student
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 bg-[#0B1812] border border-[#123D2A] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">Verified Student Workspace</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0]">
              Welcome, {currentUser.fullName}
            </h2>
            <p className="text-xs text-[#9BAAA0] mt-1">
              Roll No: <span className="font-mono text-[#F2F6F0]">{studentRecord?.rollNumber || 'CE-2025-014'}</span> · Programme: <span className="text-[#B8D8C2]">{studentRecord?.programmeName || 'B.Tech Computer Engineering'}</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('exports')}
            className="px-4 py-2.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5 text-[#B8D8C2]" />
            <span>Download Enrolment Summary</span>
          </button>
        </div>

        {/* Correction Request Alert if present */}
        {studentRecord?.hasCorrectionRequest && (
          <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-300">Action Required: Correction Requested</div>
              <p className="mt-1 text-amber-200/90 leading-relaxed">
                {studentRecord.correctionRequestNote || 'Please update your demographic details to align with official secondary examination records.'}
              </p>
              <button
                onClick={() => onNavigateTab('students')}
                className="mt-2.5 px-3 py-1 bg-amber-900/60 hover:bg-amber-900 text-amber-100 rounded text-xs font-medium cursor-pointer"
              >
                Inspect Record & Resolve
              </button>
            </div>
          </div>
        )}

        {/* Student Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">APAAR Identifier Status</div>
            <div className="text-lg font-bold text-[#F2F6F0] mt-2 font-mono flex items-center gap-2">
              <span>{studentRecord?.apaarMasked || '••••-••••-8192'}</span>
              <span className="text-xs px-2 py-0.5 rounded font-sans font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
                Format Valid
              </span>
            </div>
            <p className="text-[11px] text-[#9BAAA0] mt-2">
              APAAR 12-digit format verified against state admission merit list.
            </p>
          </div>

          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Enrolment Lifecycle Status</div>
            <div className="text-lg font-bold text-[#B8D8C2] mt-2 capitalize flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{studentRecord?.enrolmentStatus || 'Active'}</span>
            </div>
            <p className="text-[11px] text-[#9BAAA0] mt-2">
              Academic Year {activeYear} · Admission Date: {studentRecord?.admissionDate || '2025-07-28'}
            </p>
          </div>

          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Document Verification</div>
            <div className="text-lg font-bold text-[#F2F6F0] mt-2 font-mono">
              {studentRecord?.documentsCount || 3} / 4 Verified
            </div>
            <p className="text-[11px] text-[#9BAAA0] mt-2">
              Class 10/12 marksheets, Domicile & State CET Scorecard submitted.
            </p>
          </div>
        </div>

        {/* Quick Actions for Student */}
        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <h3 className="text-sm font-semibold text-[#F2F6F0] mb-3">Permitted Student Operations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigateTab('qr_identity')}
              className="p-3 bg-[#07110D] hover:bg-[#123D2A]/50 border border-[#123D2A] hover:border-[#1D6B48] rounded-lg text-left text-xs transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-[#B8D8C2]">View My QR Identity Card</div>
                <div className="text-[#9BAAA0] text-[11px] mt-0.5">Download scannable identity card with instant mobile verification.</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#B8D8C2] shrink-0 ml-2" />
            </button>
            <button
              onClick={() => onNavigateTab('students')}
              className="p-3 bg-[#07110D] hover:bg-[#123D2A]/50 border border-[#123D2A] rounded-lg text-left text-xs transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-[#F2F6F0]">View Complete Profile Record</div>
                <div className="text-[#9BAAA0] text-[11px] mt-0.5">Inspect stored fields, admission quota, and registration details.</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#B8D8C2] shrink-0 ml-2" />
            </button>
            <button
              onClick={() => onNavigateTab('verification')}
              className="p-3 bg-[#07110D] hover:bg-[#123D2A]/50 border border-[#123D2A] rounded-lg text-left text-xs transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-[#F2F6F0]">Verify APAAR ID Checksum</div>
                <div className="text-[#9BAAA0] text-[11px] mt-0.5">Test 12-digit format and Verhoeff integrity algorithm.</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#B8D8C2] shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. STAFF / OPERATOR VIEW
  if (currentUser.role === 'staff') {
    const pendingValidation = findings.filter((f) => f.status === 'open').length;
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#B8D8C2]">Admissions & Operations Cell</span>
            <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
              Staff Enrolment Workspace
            </h2>
            <p className="text-xs text-[#9BAAA0] mt-1">
              Authorised Scope: <span className="text-[#F2F6F0] font-medium">{currentUser.institutionName}</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('import_wizard')}
            className="px-4 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer w-fit"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Launch Bulk Import Wizard</span>
          </button>
        </div>

        {/* Staff Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Authorised Records</div>
            <div className="text-2xl font-bold font-mono text-[#F2F6F0] mt-1 tabular-nums">
              {students.length}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">Active AY {activeYear}</div>
          </div>

          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Format Validated</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {students.filter((s) => s.verificationStatus === 'format_valid' || s.verificationStatus === 'officially_verified').length}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">Passed 12-digit rules</div>
          </div>

          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Open Validation Findings</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {pendingValidation}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">Requires review/correction</div>
          </div>

          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Batch Imports Executed</div>
            <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
              {appStore.getImportBatches().length}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">CSV/XLSX uploaded</div>
          </div>
        </div>

        {/* Quick Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <h3 className="text-sm font-semibold text-[#F2F6F0] mb-3 flex items-center justify-between">
              <span>Awaiting Validation Review</span>
              <button onClick={() => onNavigateTab('validation')} className="text-xs text-[#B8D8C2] hover:underline cursor-pointer">
                View all ({findings.length})
              </button>
            </h3>
            {findings.length === 0 ? (
              <p className="text-xs text-[#9BAAA0] py-4">No open validation findings in this institution.</p>
            ) : (
              <div className="space-y-2.5">
                {findings.slice(0, 3).map((f) => (
                  <div key={f.id} className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#F2F6F0]">
                      <span>{f.studentName}</span>
                      <span className="font-mono text-[10px] text-amber-400 uppercase">{f.severity} severity</span>
                    </div>
                    <p className="text-[#9BAAA0] text-[11px] mt-1">{f.issueCategory}: {f.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <h3 className="text-sm font-semibold text-[#F2F6F0] mb-3">Staff Operator Shortcuts</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('students')}
                className="w-full p-2.5 bg-[#07110D] hover:bg-[#123D2A]/50 border border-[#123D2A] rounded-lg text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <span className="text-[#F2F6F0]">Add Individual Student Record</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8D8C2]" />
              </button>
              <button
                onClick={() => onNavigateTab('import_wizard')}
                className="w-full p-2.5 bg-[#07110D] hover:bg-[#123D2A]/50 border border-[#123D2A] rounded-lg text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <span className="text-[#F2F6F0]">Upload Batch CSV / XLSX File</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8D8C2]" />
              </button>
              <button
                onClick={() => onNavigateTab('exports')}
                className="w-full p-2.5 bg-[#07110D] hover:bg-[#123D2A]/50 border border-[#123D2A] rounded-lg text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <span className="text-[#F2F6F0]">Export Filtered Student Directory (CSV)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8D8C2]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. PLATFORM ADMINISTRATOR / OVERSIGHT VIEW
  if (currentUser.role === 'platform_admin') {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">National Depository Oversight</span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Platform Oversight Dashboard
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Central monitoring across AICTE-approved institutions and state technical directories.
          </p>
        </div>

        {/* Oversight KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Registered Institutions</div>
            <div className="text-2xl font-bold font-mono text-[#F2F6F0] mt-1 tabular-nums">
              {institutions.length}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">AICTE EoA Grounded</div>
          </div>

          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Institutional Claims</div>
            <div className="text-2xl font-bold font-mono text-[#C8AA6E] mt-1 tabular-nums">
              {institutions.filter((i) => i.claimStatus === 'claim_pending').length} Pending
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">Requires review</div>
          </div>

          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Total Enrolled Students</div>
            <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
              {students.length}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">Across all authorized institutions</div>
          </div>

          <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <div className="text-xs text-[#9BAAA0]">Cross-Batch Duplicates</div>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1 tabular-nums">
              {duplicates.length}
            </div>
            <div className="text-[11px] text-[#9BAAA0] mt-1">Deterministic HMAC flags</div>
          </div>
        </div>

        {/* Oversight Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <h3 className="text-sm font-semibold text-[#F2F6F0] mb-3 flex items-center justify-between">
              <span>Institution Claim Queue</span>
              <button onClick={() => onNavigateTab('institutions')} className="text-xs text-[#B8D8C2] hover:underline cursor-pointer">
                Manage all
              </button>
            </h3>
            <div className="space-y-2.5">
              {institutions.map((inst) => (
                <div key={inst.id} className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#F2F6F0]">{inst.name}</div>
                    <div className="text-[11px] text-[#9BAAA0] font-mono">AICTE ID: {inst.aictePermanentId} · {inst.state}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
                    inst.claimStatus === 'verified_active'
                      ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                      : 'text-amber-400 border-amber-800 bg-amber-950/40'
                  }`}>
                    {inst.claimStatus === 'verified_active' ? 'Active' : 'Pending Claim'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
            <h3 className="text-sm font-semibold text-[#F2F6F0] mb-3">System Health & Reference Sync</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#F2F6F0]">LG Directory Dataset</div>
                  <div className="text-[11px] text-[#9BAAA0]">All 8 major states & districts verified</div>
                </div>
                <span className="text-emerald-400 font-mono text-[11px]">Synced (v2025.2)</span>
              </div>
              <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#F2F6F0]">AICTE EoA Repository</div>
                  <div className="text-[11px] text-[#9BAAA0]">Extension of Approval letter references loaded</div>
                </div>
                <span className="text-emerald-400 font-mono text-[11px]">Online</span>
              </div>
              <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#F2F6F0]">APAAR / ABC API Gateway</div>
                  <div className="text-[11px] text-[#9BAAA0]">DigiLocker / API Setu Connector</div>
                </div>
                <span className="text-[#C8AA6E] font-mono text-[11px]">Sandbox Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. INSTITUTION ADMINISTRATOR VIEW (Default comprehensive executive dashboard)
  const totalStudents = students.length;
  const formatValidCount = students.filter(
    (s) => s.verificationStatus === 'format_valid' || s.verificationStatus === 'officially_verified'
  ).length;
  const issuesCount = findings.filter((f) => f.status === 'open').length;
  const duplicateCount = duplicates.filter((d) => d.status === 'pending_review').length;

  // Calculate total approved intake across this institution's programmes
  const totalApprovedIntake = programmes.reduce((acc, p) => acc + p.approvedIntake, 0);
  const intakeUtilPercent = totalApprovedIntake > 0 ? Math.round((totalStudents / totalApprovedIntake) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">Institutional Overview</span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            {currentUser.institutionName}
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Academic Year {activeYear} · AICTE Permanent ID: <span className="font-mono text-[#F2F6F0]">1-4328911</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('import_wizard')}
            className="px-3.5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import Batch</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 bg-[#0B1812] hover:bg-[#123D2A] text-[#F2F6F0] border border-[#123D2A] hover:border-[#1D6B48] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#B8D8C2]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Total Authorised Enrolment</div>
          <div className="text-2xl font-bold font-mono text-[#F2F6F0] mt-1 tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">
            {formatValidCount} formatted & verified
          </div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">AICTE Approved Capacity</div>
          <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
            {totalStudents} / {totalApprovedIntake}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1 flex items-center gap-1.5">
            <span className="font-mono font-semibold text-[#F2F6F0]">{intakeUtilPercent}%</span>
            <span>seat utilization</span>
          </div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Open Validation Findings</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {issuesCount}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">
            {issuesCount > 0 ? 'Requires institutional review' : 'No open violations'}
          </div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Duplicate Identifier Flags</div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1 tabular-nums">
            {duplicateCount}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Keyed HMAC matches</div>
        </div>
      </div>

      {/* Programme Enrolment vs Approved Intake Progress Table */}
      <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Programme-Wise Enrolment vs Approved Intake</h3>
            <p className="text-xs text-[#9BAAA0] mt-0.5">Direct comparison against official AICTE Extension of Approval (EoA) allocations.</p>
          </div>
          <button
            onClick={() => onNavigateTab('intake')}
            className="text-xs text-[#B8D8C2] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Intake Monitoring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#123D2A] text-[#9BAAA0] pb-2">
                <th className="pb-2 font-medium">Programme Name</th>
                <th className="pb-2 font-medium">Code</th>
                <th className="pb-2 font-medium">Approved Intake</th>
                <th className="pb-2 font-medium">Current Enrolment</th>
                <th className="pb-2 font-medium">Capacity Utilization</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123D2A]/50">
              {programmes.map((p) => {
                const enrolledInProg = students.filter((s) => s.programmeId === p.id).length;
                const util = Math.round((enrolledInProg / p.approvedIntake) * 100);
                const isOverflow = enrolledInProg > p.approvedIntake;
                return (
                  <tr key={p.id} className="hover:bg-[#123D2A]/20 transition-colors">
                    <td className="py-2.5 font-medium text-[#F2F6F0]">{p.name}</td>
                    <td className="py-2.5 font-mono text-[#9BAAA0]">{p.code}</td>
                    <td className="py-2.5 font-mono tabular-nums text-[#F2F6F0]">{p.approvedIntake}</td>
                    <td className="py-2.5 font-mono tabular-nums text-[#F2F6F0]">{enrolledInProg}</td>
                    <td className="py-2.5 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#07110D] rounded-full overflow-hidden border border-[#123D2A]">
                          <div
                            className={`h-full rounded-full ${
                              isOverflow ? 'bg-red-500' : util > 85 ? 'bg-[#C8AA6E]' : 'bg-[#1D6B48]'
                            }`}
                            style={{ width: `${Math.min(util, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#9BAAA0] tabular-nums w-8">
                          {util}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      {isOverflow ? (
                        <span className="text-[10px] font-mono text-red-400 border border-red-800 bg-red-950/40 px-2 py-0.5 rounded uppercase">
                          Over Capacity
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/40 bg-emerald-950/20 px-2 py-0.5 rounded uppercase">
                          Within Limit
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Recent Validation Findings & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Recent Validation Flags</h3>
            <button
              onClick={() => onNavigateTab('validation')}
              className="text-xs text-[#B8D8C2] hover:underline cursor-pointer"
            >
              Inspect all
            </button>
          </div>
          {findings.length === 0 ? (
            <div className="text-xs text-[#9BAAA0] py-6 text-center">
              No active validation findings logged.
            </div>
          ) : (
            <div className="space-y-2.5">
              {findings.slice(0, 3).map((f) => (
                <div key={f.id} className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#F2F6F0]">
                    <span>{f.studentName} ({f.apaarMasked})</span>
                    <span className="font-mono text-[10px] text-amber-400">{f.severity.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-[#9BAAA0] mt-1">{f.issueCategory} · {f.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Institutional Audit Trail</h3>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs text-[#B8D8C2] hover:underline cursor-pointer"
            >
              Full log
            </button>
          </div>
          <div className="space-y-2.5">
            {auditEvents.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs">
                <div className="flex items-center justify-between font-semibold text-[#F2F6F0]">
                  <span className="font-mono text-[#B8D8C2]">{a.actionType}</span>
                  <span className="font-mono text-[10px] text-[#9BAAA0]">
                    {new Date(a.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-[#9BAAA0] mt-1">{a.summary}</p>
                <div className="text-[10px] text-[#9BAAA0]/70 mt-1 font-mono">By: {a.actorName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
