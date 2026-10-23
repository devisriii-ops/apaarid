export type UserRole = 'student' | 'staff' | 'institution_admin' | 'platform_admin';

export type VerificationStatus =
  | 'not_submitted'
  | 'pending_validation'
  | 'validation_issues'
  | 'awaiting_correction'
  | 'awaiting_review'
  | 'format_valid'
  | 'officially_verified'
  | 'verification_failed'
  | 'rejected';

export type EnrolmentStatus =
  | 'active'
  | 'on_leave'
  | 'discontinued'
  | 'completed'
  | 'lateral_entry';

export type AdmissionCategory =
  | 'OPEN'
  | 'OBC-NCL'
  | 'SC'
  | 'ST'
  | 'EWS'
  | 'PWD'
  | 'TFW'
  | 'NRI/PIO'
  | 'MANAGEMENT';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institutionId?: string;
  institutionName?: string;
  department?: string;
  studentId?: string;
  verified: boolean;
  avatarUrl?: string;
}

export interface Institution {
  id: string;
  name: string;
  aictePermanentId: string;
  state: string;
  district: string;
  category: string; // e.g. "Engineering & Technology", "Management"
  managementType: string; // "Government", "Govt-Aided", "Private-Self Financing", "University"
  aicteApprovalRef: string;
  academicYear: string;
  approvalStatus: 'Approved' | 'Extension of Approval (EoA)' | 'Under Review' | 'Provisional';
  effectivePeriod: string;
  sourceReference: string;
  datasetVersion: string;
  lastRetrievedDate: string;
  claimStatus: 'verified_active' | 'claim_pending' | 'unclaimed';
  contactEmail?: string;
  website?: string;
}

export interface Programme {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  department: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctoral';
  approvedIntake: number;
  academicYear: string;
  status: 'Active' | 'Suspended' | 'Discontinued';
  aicteApprovalRef: string;
  lastUpdated: string;
}

export interface StudentRecord {
  id: string;
  studentName: string;
  apaarMasked: string; // ••••-••••-1234
  apaarHmac: string; // Deterministic keyed hash for duplicate matching
  dob: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  rollNumber: string;
  registrationNo: string;
  institutionId: string;
  institutionName: string;
  programmeId: string;
  programmeName: string;
  academicYear: string;
  admissionDate: string;
  admissionCategory: AdmissionCategory;
  admissionQuota: 'Merit / State CET' | 'Management' | 'Lateral Entry' | 'Supernumerary / PMSSS';
  enrolmentStatus: EnrolmentStatus;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  email: string;
  phoneMasked: string;
  hasCorrectionRequest?: boolean;
  correctionRequestNote?: string;
  archived: boolean;
  documentsCount: number;
  qrToken: string; // Cryptographically random secure token
  qrIssuedAt: string;
  qrStatus: 'active' | 'revoked' | 'expired';
  qrRevokedAt?: string;
  qrRevokedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportBatch {
  id: string;
  institutionId: string;
  institutionName: string;
  filename: string;
  academicYear: string;
  programmeId?: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  uploadedAt: string;
  status: 'Completed' | 'Completed with Warnings' | 'Failed' | 'Processing';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  skippedRows: number;
  outcome: string;
  errorLog?: Array<{ row: number; field: string; error: string; rawValue: string }>;
}

export interface ValidationFinding {
  id: string;
  institutionId: string;
  institutionName: string;
  studentId: string;
  studentName: string;
  apaarMasked: string;
  issueCategory:
    | 'Invalid APAAR Format'
    | 'Academic Year Mismatch'
    | 'Approved Intake Overflow'
    | 'Missing Mandatory Field'
    | 'Suspected Duplicate Identifier'
    | 'Inconsistent Enrolment Dates';
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  evidence: string;
  detectedAt: string;
  status: 'open' | 'in_review' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface DuplicateCandidate {
  id: string;
  institutionId: string;
  institutionName: string;
  studentA: {
    id: string;
    name: string;
    apaarMasked: string;
    institution: string;
    programme: string;
    academicYear: string;
    admissionDate: string;
  };
  studentB: {
    id: string;
    name: string;
    apaarMasked: string;
    institution: string;
    programme: string;
    academicYear: string;
    admissionDate: string;
  };
  matchReason: string;
  matchType: 'Deterministic Identifier Hash' | 'Roll No & Institutional Conflict' | 'Demographic Match';
  confidenceScore: number; // 0 to 100
  detectedAt: string;
  status: 'pending_review' | 'confirmed_duplicate' | 'legitimate_separate' | 'info_requested' | 'dismissed';
  reviewDecision?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  institutionId?: string;
  institutionName?: string;
  actionType:
    | 'STUDENT_CREATED'
    | 'STUDENT_UPDATED'
    | 'STUDENT_CORRECTED'
    | 'STUDENT_ARCHIVED'
    | 'BATCH_IMPORTED'
    | 'VALIDATION_RESOLVED'
    | 'DUPLICATE_DECIDED'
    | 'PROGRAMME_CREATED'
    | 'REPORT_EXPORTED'
    | 'MEMBERSHIP_UPDATED'
    | 'CLAIM_SUBMITTED'
    | 'CLAIM_APPROVED'
    | 'VERIFICATION_CHECK_EXECUTED'
    | 'QR_GENERATED'
    | 'QR_REVOKED'
    | 'QR_REISSUED'
    | 'QR_VERIFIED';
  entityType: 'student' | 'import_batch' | 'validation_finding' | 'duplicate_candidate' | 'institution' | 'programme' | 'report' | 'qr_identity';
  entityId: string;
  summary: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  targetRole?: UserRole | 'all';
  institutionId?: string;
  read: boolean;
  linkTab?: string;
}

export interface ExportHistoryRecord {
  id: string;
  timestamp: string;
  userEmail: string;
  reportType: string;
  institutionName: string;
  academicYear: string;
  format: 'PDF' | 'CSV';
  recordCount: number;
  status: 'Completed';
}
