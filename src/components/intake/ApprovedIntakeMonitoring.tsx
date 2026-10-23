import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Programme } from '../../types';
import { appStore } from '../../services/store';

export const ApprovedIntakeMonitoring: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const instId = currentUser.institutionId || appStore.getActiveInstitutionId();
  const institution = appStore.getInstitutionById(instId);
  const programmes = appStore.getProgrammes(instId);
  const students = appStore.getStudents();
  const activeYear = appStore.getActiveAcademicYear();

  const totalApproved = programmes.reduce((acc, p) => acc + p.approvedIntake, 0);
  const totalEnrolled = students.length;
  const overallUtil = totalApproved > 0 ? Math.round((totalEnrolled / totalApproved) * 100) : 0;
  const remainingTotalSeats = Math.max(0, totalApproved - totalEnrolled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            AICTE Regulatory Capacity Alignment
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Approved Intake & Capacity Monitoring
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Grounded against official Extension of Approval (EoA) reference allocations for Academic Year {activeYear}.
          </p>
        </div>

        <div className="p-2.5 bg-[#0B1812] border border-[#123D2A] rounded-lg text-xs font-mono text-[#B8D8C2] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C8AA6E]" />
          <span>EoA Ref: {institution?.aicteApprovalRef || 'AICTE/WRO/1-4328911/2024-25/EOA'}</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Approved Capacity (Total Seats)</div>
          <div className="text-2xl font-bold font-mono text-[#F2F6F0] mt-1 tabular-nums">
            {totalApproved}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Sanctioned by AICTE</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Current Authorised Enrolment</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {totalEnrolled}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Active verified students</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Remaining Unfilled Seats</div>
          <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
            {remainingTotalSeats}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Available for admissions</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Aggregate Seat Utilisation</div>
          <div className="text-2xl font-bold font-mono text-[#C8AA6E] mt-1 tabular-nums">
            {overallUtil}%
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Capacity absorbed</div>
        </div>
      </div>

      {/* Programme-Level Capacity Table */}
      <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Programme-Wise Sanctioned Capacity & Utilisation</h3>
            <p className="text-xs text-[#9BAAA0] mt-0.5">
              Enforces strict AICTE EoA capacity limits across Undergraduate and Postgraduate degrees.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#123D2A] text-[#9BAAA0] pb-2">
                <th className="pb-2 font-medium">Programme Name & Code</th>
                <th className="pb-2 font-medium">Degree Level</th>
                <th className="pb-2 font-medium">Approved Intake</th>
                <th className="pb-2 font-medium">Enrolled Students</th>
                <th className="pb-2 font-medium">Remaining Seats</th>
                <th className="pb-2 font-medium">Seat Utilisation</th>
                <th className="pb-2 font-medium">Regulatory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123D2A]/50">
              {programmes.map((p) => {
                const enrolled = students.filter((s) => s.programmeId === p.id).length;
                const remaining = Math.max(0, p.approvedIntake - enrolled);
                const util = Math.round((enrolled / p.approvedIntake) * 100);
                const isOverenrolled = enrolled > p.approvedIntake;

                return (
                  <tr key={p.id} className="hover:bg-[#123D2A]/20 transition-colors">
                    <td className="py-3 font-medium text-[#F2F6F0]">
                      <div>{p.name}</div>
                      <div className="font-mono text-[10px] text-[#9BAAA0]">{p.code} · {p.department}</div>
                    </td>
                    <td className="py-3 text-[#9BAAA0]">{p.level}</td>
                    <td className="py-3 font-mono tabular-nums text-[#F2F6F0] font-semibold">{p.approvedIntake}</td>
                    <td className="py-3 font-mono tabular-nums text-[#B8D8C2] font-semibold">{enrolled}</td>
                    <td className="py-3 font-mono tabular-nums text-[#9BAAA0]">{remaining}</td>
                    <td className="py-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#07110D] rounded-full overflow-hidden border border-[#123D2A]">
                          <div
                            className={`h-full rounded-full ${
                              isOverenrolled ? 'bg-red-500' : util > 85 ? 'bg-[#C8AA6E]' : 'bg-[#1D6B48]'
                            }`}
                            style={{ width: `${Math.min(util, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#9BAAA0] tabular-nums w-8">
                          {util}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {isOverenrolled ? (
                        <span className="text-[10px] font-mono text-red-400 border border-red-800 bg-red-950/40 px-2 py-0.5 rounded uppercase">
                          Over-Enrolment Alert
                        </span>
                      ) : util >= 90 ? (
                        <span className="text-[10px] font-mono text-[#C8AA6E] border border-[#C8AA6E]/40 bg-[#C8AA6E]/10 px-2 py-0.5 rounded uppercase">
                          Near Full Capacity
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/40 bg-emerald-950/20 px-2 py-0.5 rounded uppercase">
                          Within Approved Intake
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

      {/* Regulatory Notice */}
      <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl flex items-start gap-3 text-xs text-[#9BAAA0]">
        <ShieldCheck className="w-5 h-5 text-[#B8D8C2] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#F2F6F0]">Regulatory Grounding Principle:</strong> All sanctioned intake metrics are directly linked to official AICTE Extension of Approval records. No student can be marked officially verified if the programme intake threshold is exceeded without an authenticated supernumerary / PMSSS exemption tag.
        </div>
      </div>
    </div>
  );
};
