import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Key, Calendar, GraduationCap, Building2, User, Printer, Archive } from 'lucide-react';
import { StudentRecord } from '../../types';
import { appStore } from '../../services/store';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
  onRefresh: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onRefresh
}) => {
  const currentUser = appStore.getCurrentUser();
  const [correctionNote, setCorrectionNote] = useState('');
  const [isRequestingCorrection, setIsRequestingCorrection] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiveReason, setArchiveReason] = useState('Graduation / Transferred');

  if (!isOpen || !student) return null;

  const handleSendCorrection = () => {
    if (!correctionNote.trim()) return;
    appStore.requestStudentCorrection(student.id, correctionNote.trim());
    setIsRequestingCorrection(false);
    setCorrectionNote('');
    onRefresh();
  };

  const handleArchive = () => {
    appStore.archiveStudent(student.id, archiveReason);
    setShowArchiveConfirm(false);
    onRefresh();
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0] max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9BAAA0] hover:text-[#F2F6F0] p-1.5 rounded-lg hover:bg-[#123D2A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between pr-8 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
                Student Master Record
              </span>
              <span className="text-[10px] font-mono text-[#9BAAA0] border border-[#123D2A] px-1.5 py-0.5 rounded">
                ID: {student.id}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0]">
              {student.studentName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#9BAAA0] mt-1">
              <span>Roll: <strong className="font-mono text-[#F2F6F0]">{student.rollNumber}</strong></span>
              <span>·</span>
              <span>PRN: <strong className="font-mono text-[#F2F6F0]">{student.registrationNo}</strong></span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-block px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded border ${
              student.verificationStatus === 'officially_verified'
                ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                : student.verificationStatus === 'format_valid'
                ? 'text-[#B8D8C2] border-[#1D6B48] bg-[#123D2A]/60'
                : 'text-amber-400 border-amber-800 bg-amber-950/40'
            }`}>
              {student.verificationStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Correction Alert if flagged */}
        {student.hasCorrectionRequest && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-300">Active Correction Request Pending</div>
              <p className="mt-0.5 text-amber-200/90">{student.correctionRequestNote}</p>
            </div>
          </div>
        )}

        {/* Cryptographic APAAR Protection Section */}
        <div className="p-4 bg-[#07110D] border border-[#123D2A] rounded-xl mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#C8AA6E]" />
              <span className="text-xs font-semibold text-[#F2F6F0]">Deterministic Identifier Architecture</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-900 bg-emerald-950/40 px-2 py-0.5 rounded">
              Privacy Masked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#9BAAA0] text-[11px]">Display APAAR ID:</span>
              <div className="font-mono font-bold text-sm text-[#F2F6F0] mt-0.5">
                {student.apaarMasked}
              </div>
            </div>
            <div>
              <span className="text-[#9BAAA0] text-[11px]">Keyed SHA-256 HMAC (Duplicate Engine):</span>
              <div className="font-mono text-[11px] text-[#B8D8C2] truncate mt-0.5" title={student.apaarHmac}>
                {student.apaarHmac}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#123D2A] text-[11px] text-[#9BAAA0] leading-relaxed">
            <strong className="text-[#F2F6F0]">Verification Audit Note:</strong> {student.verificationNotes || '12-digit format verified against state admission register.'}
          </div>
        </div>

        {/* Demographic & Enrolment Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-5">
          <div className="p-4 bg-[#07110D] border border-[#123D2A] rounded-xl space-y-2">
            <div className="text-[11px] font-mono uppercase text-[#C8AA6E]">Enrolment Metadata</div>
            <div>
              <span className="text-[#9BAAA0]">Institution:</span>
              <div className="font-medium text-[#F2F6F0] mt-0.5">{student.institutionName}</div>
            </div>
            <div>
              <span className="text-[#9BAAA0]">Academic Programme:</span>
              <div className="font-medium text-[#B8D8C2] mt-0.5">{student.programmeName}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[#9BAAA0]">Academic Year:</span>
                <div className="font-mono text-[#F2F6F0]">{student.academicYear}</div>
              </div>
              <div>
                <span className="text-[#9BAAA0]">Admission Date:</span>
                <div className="font-mono text-[#F2F6F0]">{student.admissionDate}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#07110D] border border-[#123D2A] rounded-xl space-y-2">
            <div className="text-[11px] font-mono uppercase text-[#C8AA6E]">Category & Quota Verification</div>
            <div>
              <span className="text-[#9BAAA0]">Admission Quota:</span>
              <div className="font-medium text-[#F2F6F0] mt-0.5">{student.admissionQuota}</div>
            </div>
            <div>
              <span className="text-[#9BAAA0]">Social / Reservation Category:</span>
              <div className="font-mono font-semibold text-[#F2F6F0] mt-0.5">{student.admissionCategory}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[#9BAAA0]">Gender:</span>
                <div className="text-[#F2F6F0]">{student.gender}</div>
              </div>
              <div>
                <span className="text-[#9BAAA0]">Date of Birth:</span>
                <div className="font-mono text-[#F2F6F0]">{student.dob}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Correction Request Form */}
        {isRequestingCorrection && (
          <div className="p-4 bg-[#07110D] border border-amber-800/60 rounded-xl mb-4 space-y-3">
            <div className="text-xs font-semibold text-amber-300">Submit Institutional Correction Request</div>
            <textarea
              rows={3}
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="Detail the specific document or spelling correction needed from the student..."
              className="w-full p-2.5 bg-[#0B1812] border border-[#123D2A] rounded-lg text-xs text-[#F2F6F0] focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsRequestingCorrection(false)}
                className="px-3 py-1.5 text-xs text-[#9BAAA0] hover:text-[#F2F6F0]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCorrection}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg cursor-pointer"
              >
                Dispatch Correction Request
              </button>
            </div>
          </div>
        )}

        {/* Archive Confirmation Dialog */}
        {showArchiveConfirm && (
          <div className="p-4 bg-red-950/30 border border-red-800/60 rounded-xl mb-4 space-y-3">
            <div className="text-xs font-semibold text-red-300">Confirm Record Archival</div>
            <p className="text-xs text-[#9BAAA0]">
              Archiving hides this student from active intake monitoring and directory queries while preserving the historical audit log.
            </p>
            <input
              type="text"
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              placeholder="Reason for archival (e.g. Completed Degree, Transfer Out)"
              className="w-full p-2 text-xs bg-[#07110D] border border-red-800/40 rounded-lg text-[#F2F6F0]"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-3 py-1.5 text-xs text-[#9BAAA0]"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-[#123D2A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-xs font-medium rounded-lg text-[#9BAAA0] hover:text-[#F2F6F0] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Record</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role !== 'student' && (
              <>
                <button
                  onClick={() => setIsRequestingCorrection(true)}
                  className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Request Correction</span>
                </button>
                <button
                  onClick={() => setShowArchiveConfirm(true)}
                  className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-800/50 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
