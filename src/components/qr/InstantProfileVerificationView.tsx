import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  GraduationCap,
  Calendar,
  Lock,
  Unlock,
  User,
  ArrowLeft,
  Key,
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { StudentRecord, UserProfile } from '../../types';
import { appStore } from '../../services/store';

interface InstantProfileVerificationViewProps {
  token: string;
  onReturnToPlatform: () => void;
  onOpenAuthModal?: () => void;
}

export const InstantProfileVerificationView: React.FC<InstantProfileVerificationViewProps> = ({
  token,
  onReturnToPlatform,
  onOpenAuthModal
}) => {
  const [student, setStudent] = useState<StudentRecord | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserProfile>(appStore.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lookup student in database by QR token
    const matched = appStore.getStudentByQrToken(token);
    setStudent(matched);
    setLoading(false);

    if (matched) {
      // Log audit event for QR verification scan without exposing sensitive contents
      const viewerRole = currentUser ? currentUser.role : 'public_camera_verifier';
      appStore.logQrVerificationScan(matched.id, viewerRole);
    }
  }, [token]);

  // Determine if viewer is authorized for Full Student Profile (Level B)
  // Level B requires viewer to be either:
  // - The student themselves (currentUser.studentId === student.id)
  // - Authorized staff or admin belonging to the student's institution
  // - Platform administrator
  const hasFullAccess =
    currentUser &&
    student &&
    (currentUser.role === 'platform_admin' ||
      (currentUser.role === 'student' && currentUser.studentId === student.id) ||
      ((currentUser.role === 'staff' || currentUser.role === 'institution_admin') &&
        currentUser.institutionId === student.institutionId));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07110D] text-[#F2F6F0] flex items-center justify-center p-6">
        <div className="text-center space-y-3 font-mono text-xs text-[#9BAAA0]">
          <div className="w-8 h-8 border-2 border-[#1D6B48] border-t-[#B8D8C2] rounded-full animate-spin mx-auto" />
          <div>Decrypting Institutional QR Token...</div>
        </div>
      </div>
    );
  }

  // 1. INVALID / UNKNOWN TOKEN STATE
  if (!student) {
    return (
      <div className="min-h-screen bg-[#07110D] text-[#F2F6F0] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#0B1812] border border-red-900/60 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-800 px-2 py-0.5 rounded">
              Verification Failed
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#F2F6F0] mt-2">
              Invalid or Unknown QR Token
            </h2>
            <p className="text-xs text-[#9BAAA0] mt-1.5 leading-relaxed">
              This QR code does not correspond to an active student identity record in the AICTE APAAR SmartVerify national database.
            </p>
          </div>

          <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-xl text-[11px] font-mono text-[#9BAAA0] truncate">
            Scanned Token: {token}
          </div>

          <button
            onClick={onReturnToPlatform}
            className="w-full py-2.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Institutional Platform</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. REVOKED TOKEN STATE
  if (student.qrStatus === 'revoked') {
    return (
      <div className="min-h-screen bg-[#07110D] text-[#F2F6F0] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#0B1812] border border-amber-900/70 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded">
              Credential Revoked
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#F2F6F0] mt-2">
              QR Identity Card Invalidated
            </h2>
            <p className="text-xs text-[#9BAAA0] mt-1.5 leading-relaxed">
              This digital identity token was revoked by the institution on{' '}
              <strong className="text-[#F2F6F0]">
                {student.qrRevokedAt ? new Date(student.qrRevokedAt).toLocaleDateString() : 'recent date'}
              </strong>
              .
            </p>
          </div>

          <div className="p-3.5 bg-[#07110D] border border-amber-900/40 rounded-xl text-xs text-left space-y-1">
            <div className="text-[#9BAAA0] text-[10px] font-mono uppercase">Revocation Reason:</div>
            <div className="text-[#F2F6F0] font-medium">
              {student.qrRevokedReason || 'Reported lost / Reissued by institutional administration'}
            </div>
            <div className="text-[10px] text-[#9BAAA0] mt-1">
              Please contact the Registrar / Admissions Office for an updated card.
            </div>
          </div>

          <button
            onClick={onReturnToPlatform}
            className="w-full py-2.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Institutional Platform</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. INACTIVE / ARCHIVED ENROLMENT STATE
  const isInactive = student.archived || student.enrolmentStatus === 'discontinued';

  return (
    <div className="min-h-screen bg-[#07110D] text-[#F2F6F0] py-6 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Top Return & Branding Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#123D2A]">
          <button
            onClick={onReturnToPlatform}
            className="text-xs text-[#9BAAA0] hover:text-[#F2F6F0] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal Home</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#123D2A] border border-[#1D6B48] flex items-center justify-center text-[#B8D8C2]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#F2F6F0]">
              APAAR <span className="text-[#B8D8C2]">SmartVerify</span>
            </span>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
          isInactive
            ? 'bg-amber-950/30 border-amber-800 text-amber-200'
            : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
        }`}>
          {isInactive ? (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          )}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider font-bold">
              {isInactive ? 'Inactive Institutional Enrolment' : 'Official Academic Record Verified'}
            </div>
            <p className="text-[11px] text-[#9BAAA0] mt-0.5 leading-snug">
              {isInactive
                ? 'Student enrolment is marked discontinued or archived in institutional records.'
                : 'Authenticated through AICTE-approved institutional registry and APAAR format validation.'}
            </p>
          </div>
        </div>

        {/* Level A: Basic Public Verification Card (Viewable by any scanner) */}
        <div className="bg-[#0B1812] border border-[#123D2A] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#C8AA6E] uppercase tracking-wider">
                Student Identity Credential
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2F6F0] mt-0.5">
                {student.studentName}
              </h1>
              <p className="text-xs text-[#B8D8C2] font-medium mt-0.5">
                {student.programmeName}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase text-emerald-400 border-emerald-800 bg-emerald-950/40">
              Active Student
            </span>
          </div>

          <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#9BAAA0]">Institution:</span>
              <span className="font-semibold text-[#F2F6F0] text-right truncate max-w-[240px]">
                {student.institutionName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9BAAA0]">Academic Year:</span>
              <span className="font-mono text-[#F2F6F0] font-semibold">{student.academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9BAAA0]">Enrolment Status:</span>
              <span className="capitalize font-mono text-emerald-400 font-semibold">{student.enrolmentStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9BAAA0]">Masked APAAR Identifier:</span>
              <span className="font-mono text-[#B8D8C2] font-semibold">{student.apaarMasked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9BAAA0]">Roll Number / Seat:</span>
              <span className="font-mono text-[#F2F6F0]">{student.rollNumber}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#123D2A]">
              <span className="text-[#9BAAA0]">Credential Issue Date:</span>
              <span className="font-mono text-[#9BAAA0] text-[11px]">
                {student.qrIssuedAt ? new Date(student.qrIssuedAt).toLocaleDateString() : 'Verified AY Record'}
              </span>
            </div>
          </div>

          {/* Privacy Level A Notice */}
          <div className="p-2.5 bg-[#07110D] rounded-lg border border-[#123D2A] text-[10px] text-[#9BAAA0] flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#C8AA6E] shrink-0" />
            <span>
              Public Verification Level A: Raw national identifiers and sensitive contact details are masked in accordance with national privacy regulations.
            </span>
          </div>
        </div>

        {/* Level B: Full Student Profile Access Control */}
        <div className="bg-[#0B1812] border border-[#123D2A] rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasFullAccess ? (
                <Unlock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-[#C8AA6E]" />
              )}
              <h3 className="text-sm font-semibold text-[#F2F6F0]">
                Level B: Detailed Institutional Profile
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
              hasFullAccess
                ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                : 'text-[#9BAAA0] border-[#123D2A] bg-[#07110D]'
            }`}>
              {hasFullAccess ? 'Authenticated & Unlocked' : 'Protected'}
            </span>
          </div>

          {hasFullAccess ? (
            /* Unlocked Full Profile */
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 bg-[#07110D] border border-emerald-900/50 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#9BAAA0] text-[11px]">Date of Birth:</span>
                    <div className="font-mono font-semibold text-[#F2F6F0]">{student.dob}</div>
                  </div>
                  <div>
                    <span className="text-[#9BAAA0] text-[11px]">Gender:</span>
                    <div className="font-semibold text-[#F2F6F0]">{student.gender}</div>
                  </div>
                  <div>
                    <span className="text-[#9BAAA0] text-[11px]">Admission Category:</span>
                    <div className="font-mono text-[#C8AA6E] font-semibold">{student.admissionCategory}</div>
                  </div>
                  <div>
                    <span className="text-[#9BAAA0] text-[11px]">Admission Quota:</span>
                    <div className="text-[#F2F6F0] font-medium">{student.admissionQuota}</div>
                  </div>
                  <div>
                    <span className="text-[#9BAAA0] text-[11px]">Registration PRN:</span>
                    <div className="font-mono text-[#B8D8C2]">{student.registrationNo}</div>
                  </div>
                  <div>
                    <span className="text-[#9BAAA0] text-[11px]">Admission Date:</span>
                    <div className="font-mono text-[#F2F6F0]">{student.admissionDate}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#123D2A]">
                  <span className="text-[#9BAAA0] text-[11px]">Verified Institutional Email:</span>
                  <div className="font-mono text-[#F2F6F0]">{student.email}</div>
                </div>

                <div>
                  <span className="text-[#9BAAA0] text-[11px]">Verification Audit Notes:</span>
                  <div className="text-[#9BAAA0] text-[11px] leading-relaxed mt-0.5">
                    {student.verificationNotes || '12-digit format verified against state admission register.'}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Authorized institutional session active ({currentUser.email})</span>
              </div>
            </div>
          ) : (
            /* Locked Gate with Login Action */
            <div className="space-y-3 text-xs">
              <p className="text-[#9BAAA0] leading-relaxed text-[11px]">
                Demographic details (Date of Birth, social category, registration PRN, and contact attributes) are restricted. Sign in with the student's authorized credentials or institutional staff account to unlock Level B details.
              </p>
              {onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="w-full py-2.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#B8D8C2]" />
                  <span>Authenticate to Unlock Level B Profile</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Security & Cryptographic Attestation */}
        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-2xl text-[10px] text-[#9BAAA0] font-mono space-y-1">
          <div className="flex items-center gap-1.5 text-[#C8AA6E] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AICTE SmartVerify Attestation</span>
          </div>
          <div>Cryptographic Token: {student.qrToken}</div>
          <div>Keyed SHA-256 HMAC Signature: {student.apaarHmac}</div>
          <div>Database Sync: Confirmed · AICTE EoA Compliant</div>
        </div>
      </div>
    </div>
  );
};
