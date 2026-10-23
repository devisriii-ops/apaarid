import React, { useState } from 'react';
import { Download, FileText, Printer, CheckCircle2, ShieldCheck, History, Calendar, User } from 'lucide-react';
import { ExportHistoryRecord } from '../../types';
import { appStore } from '../../services/store';

export const ExportCenter: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const instId = currentUser.institutionId || appStore.getActiveInstitutionId();
  const institution = appStore.getInstitutionById(instId);
  const students = appStore.getStudents();
  const exportHistory = appStore.getExportHistory();
  const activeYear = appStore.getActiveAcademicYear();

  const handleExportCsv = (title: string) => {
    const csv = appStore.exportStudentsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `APAAR_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePrintPdf = (title: string) => {
    appStore.logExport(title, 'PDF', students.length);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Secure Document & Data Dissemination
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Download & Export Centre
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Generate authenticated PDF compliance briefs and OWASP formula-sanitized CSV datasets.
          </p>
        </div>
      </div>

      {/* Security Compliance Callout */}
      <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl flex items-start gap-3 text-xs text-[#9BAAA0]">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#F2F6F0]">Export Governance Protocol:</strong> All student exports enforce automatic masking of APAAR identifiers (<code className="font-mono text-[#B8D8C2]">••••-••••-XXXX</code>). Spreadsheet exports sanitize leading special characters (<code className="font-mono text-[#C8AA6E]">=, +, -, @</code>) to protect institutional computers from formula injection.
        </div>
      </div>

      {/* Available Export Packages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#123D2A] text-[#B8D8C2] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Institutional Enrolment Roster</h3>
            <p className="text-xs text-[#9BAAA0] mt-1 leading-relaxed">
              Complete student master records containing verified admission categories, roll numbers, and masked APAAR identifiers.
            </p>
            <div className="mt-3 text-xs font-mono text-[#F2F6F0]">
              Records in Scope: <strong className="text-[#B8D8C2]">{students.length}</strong>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#123D2A] flex items-center gap-2">
            <button
              onClick={() => handleExportCsv('Student_Roster')}
              className="flex-1 py-2 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#B8D8C2]" />
              <span>CSV Dataset</span>
            </button>
            <button
              onClick={() => handlePrintPdf('Student_Roster')}
              className="px-3 py-2 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-xs font-medium rounded-lg text-[#9BAAA0] hover:text-[#F2F6F0] flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#123D2A] text-[#C8AA6E] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#F2F6F0]">AICTE Approved Intake Audit Brief</h3>
            <p className="text-xs text-[#9BAAA0] mt-1 leading-relaxed">
              Official regulatory compliance statement comparing sanctioned Extension of Approval seats against active student registrations.
            </p>
            <div className="mt-3 text-xs font-mono text-[#F2F6F0]">
              Cohort: <strong className="text-[#C8AA6E]">{activeYear}</strong>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#123D2A] flex items-center gap-2">
            <button
              onClick={() => handlePrintPdf('AICTE_Intake_Audit_Brief')}
              className="w-full py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official PDF Brief</span>
            </button>
          </div>
        </div>

        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#123D2A] text-amber-400 flex items-center justify-center mb-3">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Validation & Anomaly Log</h3>
            <p className="text-xs text-[#9BAAA0] mt-1 leading-relaxed">
              Export open findings, duplicate candidate records, and historical resolution logs for institutional audit review.
            </p>
            <div className="mt-3 text-xs font-mono text-[#F2F6F0]">
              Findings Logged: <strong className="text-amber-400">{appStore.getValidationFindings().length}</strong>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#123D2A] flex items-center gap-2">
            <button
              onClick={() => handleExportCsv('Validation_Findings_Log')}
              className="w-full py-2 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#B8D8C2]" />
              <span>Export Findings CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export History Table */}
      <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-3">
        <h3 className="text-sm font-semibold text-[#F2F6F0]">Recent Dissemination History</h3>
        {exportHistory.length === 0 ? (
          <p className="text-xs text-[#9BAAA0] py-4 text-center">No export events logged in this session yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#123D2A] text-[#9BAAA0] pb-2">
                  <th className="pb-2 font-medium">Export ID</th>
                  <th className="pb-2 font-medium">Report Disseminated</th>
                  <th className="pb-2 font-medium">Format</th>
                  <th className="pb-2 font-medium">Requested By</th>
                  <th className="pb-2 font-medium">Timestamp</th>
                  <th className="pb-2 font-medium">Records</th>
                  <th className="pb-2 font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123D2A]/50">
                {exportHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#123D2A]/20 transition-colors">
                    <td className="py-2.5 font-mono text-[#B8D8C2]">{rec.id}</td>
                    <td className="py-2.5 font-medium text-[#F2F6F0]">{rec.reportType}</td>
                    <td className="py-2.5 font-mono text-[11px] text-[#C8AA6E]">{rec.format}</td>
                    <td className="py-2.5 font-mono text-[11px] text-[#9BAAA0]">{rec.userEmail}</td>
                    <td className="py-2.5 font-mono text-[11px] text-[#9BAAA0]">
                      {new Date(rec.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 font-mono tabular-nums text-[#F2F6F0]">{rec.recordCount}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800 bg-emerald-950/40 px-2 py-0.5 rounded">
                        {rec.status}
                      </span>
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
