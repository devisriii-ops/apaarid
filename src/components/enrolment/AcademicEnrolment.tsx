import React, { useState } from 'react';
import { GraduationCap, Users, Calendar, Filter, PieChart, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { StudentRecord, AdmissionCategory, EnrolmentStatus } from '../../types';
import { appStore } from '../../services/store';

export const AcademicEnrolment: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const instId = currentUser.institutionId || appStore.getActiveInstitutionId();
  const programmes = appStore.getProgrammes(instId);
  const students = appStore.getStudents();
  const activeYear = appStore.getActiveAcademicYear();

  const [selectedProgramme, setSelectedProgramme] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredStudents = students.filter((s) => {
    if (selectedProgramme !== 'ALL' && s.programmeId !== selectedProgramme) return false;
    if (selectedStatus !== 'ALL' && s.enrolmentStatus !== selectedStatus) return false;
    return true;
  });

  // Category counts
  const categories: AdmissionCategory[] = ['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS', 'TFW'];
  const categoryBreakdown = categories.map((cat) => ({
    category: cat,
    count: filteredStudents.filter((s) => s.admissionCategory === cat).length
  }));

  // Status counts
  const statuses: EnrolmentStatus[] = ['active', 'lateral_entry', 'on_leave', 'discontinued', 'completed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Enrolment Lifecycle Tracking
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Academic Enrolment & Cohort Analysis
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Institutional cohort breakdown by degree programme, admission quota, and social reservation category.
          </p>
        </div>

        <div className="p-2.5 bg-[#0B1812] border border-[#123D2A] rounded-lg text-xs font-mono text-[#F2F6F0]">
          Cohort: <span className="text-[#B8D8C2] font-semibold">{activeYear}</span>
        </div>
      </div>

      {/* Cohort KPI Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Active Regular Students</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {students.filter((s) => s.enrolmentStatus === 'active').length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Full-time enrollees</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Lateral Entry Enrolment</div>
          <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
            {students.filter((s) => s.admissionQuota === 'Lateral Entry').length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Direct second-year</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Reservation Quota Filled</div>
          <div className="text-2xl font-bold font-mono text-[#C8AA6E] mt-1 tabular-nums">
            {students.filter((s) => s.admissionCategory !== 'OPEN').length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">OBC, SC, ST, EWS</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Correction Pending</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {students.filter((s) => s.hasCorrectionRequest).length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Awaiting resolution</div>
        </div>
      </div>

      {/* Social Category Reservation Breakdown Cards */}
      <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
        <h3 className="text-sm font-semibold text-[#F2F6F0] mb-3">
          Demographic & Reservation Category Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg">
              <span className="text-[11px] font-mono text-[#9BAAA0]">{item.category}</span>
              <div className="text-xl font-bold font-mono text-[#F2F6F0] mt-0.5 tabular-nums">
                {item.count}
              </div>
              <div className="text-[10px] text-[#9BAAA0] mt-0.5">
                {filteredStudents.length > 0 ? Math.round((item.count / filteredStudents.length) * 100) : 0}% of filtered
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Records Table with Filters */}
      <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#F2F6F0]">Cohort Enrolment Register</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="p-1.5 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs text-[#F2F6F0] focus:outline-none"
            >
              <option value="ALL">All Programmes</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs text-[#F2F6F0] focus:outline-none"
            >
              <option value="ALL">All Enrolment Statuses</option>
              <option value="active">Active</option>
              <option value="lateral_entry">Lateral Entry</option>
              <option value="on_leave">On-Leave</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#123D2A] text-[#9BAAA0]">
                <th className="py-2.5 font-medium">Roll Number</th>
                <th className="py-2.5 font-medium">Student Name</th>
                <th className="py-2.5 font-medium">Masked APAAR</th>
                <th className="py-2.5 font-medium">Programme</th>
                <th className="py-2.5 font-medium">Quota</th>
                <th className="py-2.5 font-medium">Admission Date</th>
                <th className="py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123D2A]/50">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[#123D2A]/20 transition-colors">
                  <td className="py-2.5 font-mono text-[#F2F6F0]">{s.rollNumber}</td>
                  <td className="py-2.5 font-medium text-[#F2F6F0]">{s.studentName}</td>
                  <td className="py-2.5 font-mono text-[#B8D8C2]">{s.apaarMasked}</td>
                  <td className="py-2.5 text-[#9BAAA0] truncate max-w-[180px]">{s.programmeName}</td>
                  <td className="py-2.5 text-[#C8AA6E]">{s.admissionQuota}</td>
                  <td className="py-2.5 font-mono text-[#9BAAA0]">{s.admissionDate}</td>
                  <td className="py-2.5 capitalize">
                    <span className="text-emerald-400 font-mono text-[11px]">{s.enrolmentStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
