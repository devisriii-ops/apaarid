import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  User,
  GraduationCap,
  Building2,
  Key
} from 'lucide-react';
import { StudentRecord } from '../../types';
import { appStore } from '../../services/store';
import { generateQrDataUrl, downloadQrPng, buildQrVerificationUrl } from '../../utils/qrCrypto';

interface StudentQrCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
  onRefresh: () => void;
  onOpenProfile?: (student: StudentRecord) => void;
}

export const StudentQrCardModal: React.FC<StudentQrCardModalProps> = ({
  isOpen,
  onClose,
  student,
  onRefresh,
  onOpenProfile
}) => {
  const currentUser = appStore.getCurrentUser();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isReissuing, setIsReissuing] = useState<boolean>(false);
  const [reissueReason, setReissueReason] = useState<string>('Periodic Security Refresh / Card Replacement');
  const [isRevoking, setIsRevoking] = useState<boolean>(false);
  const [revokeReason, setRevokeReason] = useState<string>('Lost Physical Card Reported by Student');

  useEffect(() => {
    if (student && isOpen) {
      const token = student.qrToken || '';
      if (token) {
        generateQrDataUrl(token, {
          width: 320,
          margin: 2,
          colorDark: '#07110D',
          colorLight: '#FFFFFF'
        }).then((url) => {
          setQrDataUrl(url);
        }).catch((err) => {
          console.error('Failed to generate QR data URL:', err);
        });
      }
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const verificationUrl = student.qrToken ? buildQrVerificationUrl(student.qrToken) : '';

  const handleCopyLink = () => {
    if (!verificationUrl) return;
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const cleanName = (student.studentName || 'Student').replace(/\s+/g, '_');
    const cleanRoll = (student.rollNumber || 'ID').replace(/\s+/g, '_');
    const filename = `QR_ID_${cleanName}_${cleanRoll}.png`;
    downloadQrPng(qrDataUrl, filename);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleConfirmReissue = () => {
    if (!student) return;
    appStore.reissueStudentQr(student.id, reissueReason);
    setIsReissuing(false);
    onRefresh();
  };

  const handleConfirmRevoke = () => {
    if (!student) return;
    appStore.revokeStudentQr(student.id, revokeReason);
    setIsRevoking(false);
    onRefresh();
  };

  const isRevoked = student.qrStatus === 'revoked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9BAAA0] hover:text-[#F2F6F0] p-1.5 rounded-lg hover:bg-[#123D2A] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
              Digital Student Identity Credential
            </span>
            <span className="text-[10px] font-mono text-[#9BAAA0] border border-[#123D2A] px-1.5 py-0.5 rounded">
              Token: {student.qrToken ? `${student.qrToken.slice(0, 16)}...` : 'Generating...'}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#F2F6F0]">
            Student QR Identity Card
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-0.5">
            Cryptographically linked digital credential for mobile verification and institutional access.
          </p>
        </div>

        {/* Revocation Banner if revoked */}
        {isRevoked && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-300">QR Identity Token Revoked</div>
              <p className="mt-0.5 text-red-200/90 leading-snug">
                This QR identity token was revoked on {student.qrRevokedAt ? new Date(student.qrRevokedAt).toLocaleDateString() : 'recent date'}.
                Reason: {student.qrRevokedReason || 'Administrative revocation'}. Mobile scanning will deny access until reissued.
              </p>
            </div>
          </div>
        )}

        {/* THE PHYSICAL-STYLE PRINTABLE IDENTITY CARD */}
        <div
          id="printable-student-id-card"
          className="relative rounded-2xl overflow-hidden border border-[#1D6B48] bg-gradient-to-br from-[#07110D] via-[#0B1812] to-[#123D2A]/70 shadow-2xl p-5 sm:p-6 mb-5"
        >
          {/* Subtle Security Holographic Watermark Pattern */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#C8AA6E]/10 to-[#1D6B48]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top: Institution Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-[#123D2A]/80 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#123D2A] border border-[#1D6B48] flex items-center justify-center text-[#B8D8C2]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#C8AA6E]">
                  AICTE-Approved Technical Institution
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#F2F6F0] line-clamp-1">
                  {student.institutionName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                isRevoked
                  ? 'text-red-400 border-red-800 bg-red-950/60'
                  : 'text-emerald-400 border-emerald-800 bg-emerald-950/60'
              }`}>
                {isRevoked ? 'Revoked' : 'Active Credential'}
              </span>
            </div>
          </div>

          {/* Card Body: Student Photo + Info + QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Student Info (Left 7 cols) */}
            <div className="sm:col-span-7 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#123D2A] border border-[#1D6B48] flex items-center justify-center text-[#B8D8C2] shrink-0 font-bold text-lg font-mono">
                  {(student.studentName || 'S').charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F2F6F0] leading-tight">
                    {student.studentName}
                  </h3>
                  <div className="text-xs text-[#B8D8C2] font-medium mt-0.5">
                    {student.programmeName}
                  </div>
                  <div className="text-[10px] text-[#9BAAA0] font-mono">
                    Roll No: <strong className="text-[#F2F6F0]">{student.rollNumber}</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#123D2A]/60 text-xs">
                <div>
                  <span className="text-[10px] text-[#9BAAA0] block">Academic Year</span>
                  <span className="font-mono text-[#F2F6F0] font-semibold">{student.academicYear}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9BAAA0] block">Enrolment Status</span>
                  <span className="font-mono text-emerald-400 capitalize font-medium">{student.enrolmentStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9BAAA0] block">Masked APAAR ID</span>
                  <span className="font-mono text-[#B8D8C2] text-[11px] font-semibold">{student.apaarMasked}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9BAAA0] block">Admission Quota</span>
                  <span className="text-[#C8AA6E] text-[11px] font-medium truncate block">{student.admissionQuota}</span>
                </div>
              </div>
            </div>

            {/* QR Code Container (Right 5 cols) */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md border border-[#123D2A]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Identity for ${student.studentName}`}
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-xs text-slate-500 font-mono">
                  Generating...
                </div>
              )}
              <div className="text-[9px] font-mono text-slate-700 font-bold uppercase tracking-wider text-center mt-1">
                Scan with Phone Camera
              </div>
              <div className="text-[8px] font-mono text-slate-500 text-center">
                Instant Academic Verification
              </div>
            </div>
          </div>

          {/* Card Footer: Security Micro-text */}
          <div className="pt-3 mt-3 border-t border-[#123D2A]/80 flex flex-col sm:flex-row sm:items-center justify-between text-[9px] font-mono text-[#9BAAA0]">
            <div>Official AICTE APAAR SmartVerify Cryptographic Token</div>
            <div>Issued: {student.qrIssuedAt ? new Date(student.qrIssuedAt).toLocaleDateString() : new Date().toLocaleDateString()} · Secure SHA-256 Digest</div>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="space-y-3">
          {/* Quick Copy Link */}
          <div className="p-2.5 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 truncate text-[#9BAAA0] font-mono text-[11px]">
              <Key className="w-3.5 h-3.5 text-[#C8AA6E] shrink-0" />
              <span className="truncate">{verificationUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-[11px] font-medium rounded transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Working Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPng}
                disabled={!qrDataUrl}
                className="px-3.5 py-2 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#B8D8C2]" />
                <span>Download QR (PNG)</span>
              </button>
              <button
                onClick={handlePrintCard}
                className="px-3.5 py-2 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-xs font-semibold rounded-lg text-[#F2F6F0] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C8AA6E]" />
                <span>Print Identity Card</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onOpenProfile && (
                <button
                  onClick={() => {
                    onOpenProfile(student);
                    onClose();
                  }}
                  className="px-3 py-2 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-xs font-medium rounded-lg text-[#9BAAA0] hover:text-[#F2F6F0] flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Profile</span>
                </button>
              )}

              {/* Admin-only Reissue and Revoke Actions */}
              {currentUser.role !== 'student' && (
                <>
                  {!isRevoked ? (
                    <button
                      onClick={() => setIsRevoking(true)}
                      className="px-2.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Revoke QR
                    </button>
                  ) : null}

                  <button
                    onClick={() => setIsReissuing(true)}
                    className="px-3 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{isRevoked ? 'Reissue New QR' : 'Reissue Token'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Revoke Confirmation Dialog */}
        {isRevoking && (
          <div className="mt-4 p-4 bg-red-950/30 border border-red-800/60 rounded-xl space-y-3">
            <div className="text-xs font-semibold text-red-300">Confirm QR Identity Token Revocation</div>
            <p className="text-xs text-[#9BAAA0]">
              Revoking invalidates this QR code immediately. Anyone scanning the card will see a revoked error status.
            </p>
            <input
              type="text"
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="Reason for revocation (e.g. Lost Physical ID, Suspicious Activity)"
              className="w-full p-2 text-xs bg-[#07110D] border border-red-800/40 rounded-lg text-[#F2F6F0]"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsRevoking(false)}
                className="px-3 py-1.5 text-xs text-[#9BAAA0]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        )}

        {/* Reissue Confirmation Dialog */}
        {isReissuing && (
          <div className="mt-4 p-4 bg-amber-950/30 border border-amber-800/60 rounded-xl space-y-3">
            <div className="text-xs font-semibold text-amber-300">Reissue Cryptographic QR Token</div>
            <p className="text-xs text-[#9BAAA0]">
              Generating a new token will permanently invalidate the previous card and assign an unguessable 32-byte cryptographic token.
            </p>
            <input
              type="text"
              value={reissueReason}
              onChange={(e) => setReissueReason(e.target.value)}
              placeholder="Reason for reissue (e.g. Replaced Card, Security Refresh)"
              className="w-full p-2 text-xs bg-[#07110D] border border-amber-800/40 rounded-lg text-[#F2F6F0]"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsReissuing(false)}
                className="px-3 py-1.5 text-xs text-[#9BAAA0]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReissue}
                className="px-4 py-1.5 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg cursor-pointer"
              >
                Generate & Reissue QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
