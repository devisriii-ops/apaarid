import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  QrCode,
  ShieldCheck,
  User,
  GraduationCap,
  Building,
  Key
} from 'lucide-react';
import { StudentRecord } from '../../types';
import { appStore } from '../../services/store';
import { StudentQrCardModal } from './StudentQrCardModal';

interface StudentQrIdentitySectionProps {
  onOpenProfile?: (student: StudentRecord) => void;
}

export const StudentQrIdentitySection: React.FC<StudentQrIdentitySectionProps> = ({
  onOpenProfile
}) => {
  const currentUser = appStore.getCurrentUser();
  const [students, setStudents] = useState<StudentRecord[]>(appStore.getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'revoked'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const refreshList = () => {
    setStudents(appStore.getStudents());
  };

  // Filter students based on search and status
  const filtered = students.filter((s) => {
    const currentStatus = s.qrStatus || 'active';
    if (statusFilter !== 'ALL' && currentStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (s.studentName || '').toLowerCase().includes(q) ||
        (s.rollNumber || '').toLowerCase().includes(q) ||
        (s.registrationNo || '').toLowerCase().includes(q) ||
        (s.apaarMasked || '').includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Check for duplicate names in the dataset to display disambiguation indicator
  const nameOccurrences = students.reduce<Record<string, number>>((acc, s) => {
    const key = (s.studentName || '').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Cryptographic Student Identity Credential System
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Student QR Identity Cards
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Search, inspect, print, and manage tamper-evident QR identity credentials for mobile phone camera verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#B8D8C2]">
          <span className="px-3 py-1 bg-[#0B1812] border border-[#123D2A] rounded-lg flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-[#C8AA6E]" />
            <span>{students.filter((s) => (s.qrStatus || 'active') === 'active').length} Active QR Credentials</span>
          </span>
        </div>
      </div>

      {/* Student Self-Service Quick Banner (If logged in as student) */}
      {currentUser.role === 'student' && students.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-[#0B1812] via-[#123D2A]/40 to-[#0B1812] border border-[#1D6B48] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#123D2A] border border-[#1D6B48] flex items-center justify-center text-[#B8D8C2] shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
                Student Self-Service Credential
              </div>
              <h3 className="text-base font-bold text-[#F2F6F0]">
                Your Official Student QR Identity Card
              </h3>
              <p className="text-xs text-[#9BAAA0] mt-0.5">
                Roll No: <span className="font-mono text-[#F2F6F0]">{students[0].rollNumber}</span> · Status:{' '}
                <span className="text-emerald-400 capitalize">{students[0].qrStatus || 'active'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedStudent(students[0]);
                setIsQrModalOpen(true);
              }}
              className="px-4 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View & Download My QR Card</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9BAAA0] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name, roll number, or institutional PRN..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] placeholder-[#9BAAA0]/50 focus:outline-none focus:border-[#1D6B48]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
          >
            <option value="ALL">All QR Credential Statuses</option>
            <option value="active">Active QR Tokens</option>
            <option value="revoked">Revoked Tokens</option>
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 px-4 bg-[#0B1812] border border-[#123D2A] rounded-xl text-center">
          <QrCode className="w-10 h-10 text-[#9BAAA0]/40 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-[#F2F6F0]">No Matching QR Identity Credentials</h4>
          <p className="text-xs text-[#9BAAA0] max-w-sm mx-auto mt-1">
            {searchQuery
              ? `No student record found matching "${searchQuery}". Please check the spelling or roll number.`
              : 'No students found with the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const hasDuplicateName = (nameOccurrences[(s.studentName || '').toLowerCase()] || 0) > 1;
            const currentStatus = s.qrStatus || 'active';
            const isRevoked = currentStatus === 'revoked';

            return (
              <div
                key={s.id}
                className={`p-5 bg-[#0B1812] border rounded-xl hover:border-[#1D6B48] transition-all flex flex-col justify-between ${
                  isRevoked ? 'border-red-900/40 opacity-75' : 'border-[#123D2A]'
                }`}
              >
                <div>
                  {/* Card Top: Status & Duplicate Warning */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#123D2A]/60">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#9BAAA0]">
                        PRN: {s.registrationNo}
                      </span>
                      {hasDuplicateName && (
                        <span className="text-[9px] font-mono text-[#C8AA6E] bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 px-1.5 py-0.2 rounded" title="Multiple students share this name; verify via Roll No">
                          Disambiguated
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        isRevoked
                          ? 'text-red-400 border-red-800 bg-red-950/40'
                          : 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>

                  {/* Student Persona Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#123D2A] border border-[#1D6B48] flex items-center justify-center text-[#B8D8C2] font-bold text-sm shrink-0 font-mono">
                      {(s.studentName || 'S').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F6F0] leading-tight">
                        {s.studentName}
                      </h3>
                      <div className="text-xs text-[#B8D8C2] mt-0.5 truncate max-w-[190px]" title={s.programmeName}>
                        {s.programmeName}
                      </div>
                      <div className="text-[11px] text-[#9BAAA0] font-mono mt-0.5">
                        Roll: <strong className="text-[#F2F6F0]">{s.rollNumber}</strong> · AY {s.academicYear}
                      </div>
                    </div>
                  </div>

                  {/* Privacy Masked APAAR ID */}
                  <div className="mt-3 p-2 bg-[#07110D] border border-[#123D2A] rounded text-xs flex items-center justify-between">
                    <span className="text-[11px] text-[#9BAAA0]">APAAR ID:</span>
                    <span className="font-mono text-[#B8D8C2] font-semibold">{s.apaarMasked}</span>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-[#9BAAA0] truncate" title={s.qrToken || ''}>
                    Token: {s.qrToken ? `${s.qrToken.slice(0, 20)}...` : 'Generating...'}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-[#123D2A] flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      setIsQrModalOpen(true);
                    }}
                    className="flex-1 py-1.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#B8D8C2]" />
                    <span>View QR Code</span>
                  </button>

                  {onOpenProfile && (
                    <button
                      onClick={() => onOpenProfile(s)}
                      className="p-1.5 text-[#9BAAA0] hover:text-[#F2F6F0] hover:bg-[#123D2A] border border-[#123D2A] rounded-lg transition-colors cursor-pointer"
                      title="Open Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Card Modal */}
      <StudentQrCardModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        student={selectedStudent}
        onRefresh={refreshList}
        onOpenProfile={onOpenProfile}
      />
    </div>
  );
};
