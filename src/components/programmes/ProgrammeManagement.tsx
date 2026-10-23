import React, { useState } from 'react';
import { BookOpen, Plus, ShieldCheck, CheckCircle2, Edit2, Layers, AlertCircle } from 'lucide-react';
import { Programme } from '../../types';
import { appStore } from '../../services/store';

export const ProgrammeManagement: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const instId = currentUser.institutionId || appStore.getActiveInstitutionId();
  const institution = appStore.getInstitutionById(instId);
  const [programmes, setProgrammes] = useState<Programme[]>(appStore.getProgrammes(instId));
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState<Programme['level']>('Undergraduate');
  const [approvedIntake, setApprovedIntake] = useState<number>(60);
  const [aicteApprovalRef, setAicteApprovalRef] = useState(`AICTE/WRO/${institution?.aictePermanentId || '1-4328911'}/NEW`);

  const refreshProgrammes = () => {
    setProgrammes(appStore.getProgrammes(instId));
  };

  const handleCreateProgramme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    appStore.addProgramme({
      institutionId: instId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      department: department.trim() || 'General Engineering',
      level,
      approvedIntake: Number(approvedIntake) || 60,
      academicYear: appStore.getActiveAcademicYear(),
      status: 'Active',
      aicteApprovalRef: aicteApprovalRef.trim()
    });

    setName('');
    setCode('');
    setDepartment('');
    setIsAddOpen(false);
    refreshProgrammes();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Institutional Curriculum & Intake Scope
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Academic Programme Management
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Approved degree disciplines, AICTE approval references, and sanctioned intake configurations.
          </p>
        </div>

        {currentUser.role !== 'student' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Programme</span>
          </button>
        )}
      </div>

      {/* Programme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programmes.map((p) => {
          const studentCount = appStore.getStudents().filter((s) => s.programmeId === p.id).length;
          return (
            <div key={p.id} className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl hover:border-[#1D6B48] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#B8D8C2] px-2 py-0.5 rounded bg-[#123D2A] border border-[#1D6B48]/50">
                  {p.code}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded bg-emerald-950/20">
                  {p.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[#F2F6F0] mb-1">{p.name}</h3>
              <p className="text-xs text-[#9BAAA0]">{p.department} · {p.level}</p>

              <div className="my-4 pt-3 border-t border-[#123D2A] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#9BAAA0] text-[11px]">Approved Intake</span>
                  <div className="font-mono font-bold text-[#F2F6F0] text-sm mt-0.5">{p.approvedIntake} Seats</div>
                </div>
                <div>
                  <span className="text-[#9BAAA0] text-[11px]">Active Enrolment</span>
                  <div className="font-mono font-bold text-[#B8D8C2] text-sm mt-0.5">{studentCount} Students</div>
                </div>
              </div>

              <div className="text-[10px] text-[#9BAAA0] font-mono truncate" title={p.aicteApprovalRef}>
                Ref: {p.aicteApprovalRef}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Programme Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0]">
            <h3 className="text-base font-bold text-[#F2F6F0]">Add Academic Programme</h3>
            <p className="text-xs text-[#9BAAA0] mt-1">
              Configure a sanctioned degree programme with official AICTE intake limits.
            </p>

            <form onSubmit={handleCreateProgramme} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-medium text-[#F2F6F0] mb-1">Programme Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. B.Tech in Artificial Intelligence & Data Science"
                  className="w-full p-2 bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F2F6F0] mb-1">Discipline Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="BTECH-AIDS"
                    className="w-full p-2 font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#F2F6F0] mb-1">Degree Level *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-2 bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                  >
                    <option value="Undergraduate">Undergraduate (UG)</option>
                    <option value="Postgraduate">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Doctoral">Doctoral (Ph.D)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F2F6F0] mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science & Eng"
                    className="w-full p-2 bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#F2F6F0] mb-1">AICTE Sanctioned Intake *</label>
                  <input
                    type="number"
                    min={10}
                    max={600}
                    required
                    value={approvedIntake}
                    onChange={(e) => setApprovedIntake(Number(e.target.value))}
                    className="w-full p-2 font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#F2F6F0] mb-1">AICTE Approval Letter Reference *</label>
                <input
                  type="text"
                  required
                  value={aicteApprovalRef}
                  onChange={(e) => setAicteApprovalRef(e.target.value)}
                  className="w-full p-2 font-mono text-[11px] bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                />
              </div>

              <div className="pt-4 border-t border-[#123D2A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-[#9BAAA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg cursor-pointer"
                >
                  Create Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
