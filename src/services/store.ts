import {
  StudentRecord,
  Institution,
  Programme,
  ImportBatch,
  ValidationFinding,
  DuplicateCandidate,
  AuditEvent,
  NotificationItem,
  UserProfile,
  UserRole,
  ExportHistoryRecord
} from '../types';
import { INITIAL_INSTITUTIONS, INITIAL_PROGRAMMES } from '../data/referenceData';
import { computeApaarHmac, maskApaar, validateApaarFormat, sanitizeForCsv } from '../utils/apaarCrypto';
import { generateSecureQrToken } from '../utils/qrCrypto';

const STORAGE_KEYS = {
  CURRENT_USER: 'apaar_current_user_v1',
  INSTITUTIONS: 'apaar_institutions_v1',
  PROGRAMMES: 'apaar_programmes_v1',
  STUDENTS: 'apaar_students_v1',
  IMPORT_BATCHES: 'apaar_import_batches_v1',
  FINDINGS: 'apaar_validation_findings_v1',
  DUPLICATES: 'apaar_duplicates_v1',
  AUDIT: 'apaar_audit_log_v1',
  NOTIFICATIONS: 'apaar_notifications_v1',
  EXPORTS: 'apaar_export_history_v1',
  ACTIVE_INSTITUTION_ID: 'apaar_active_institution_v1',
  ACTIVE_ACADEMIC_YEAR: 'apaar_active_year_v1'
};

// Default authorized users for role switching & testing
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  institution_admin: {
    id: 'user-admin-coep',
    email: 'dean.academics@coeptech.ac.in',
    fullName: 'Dr. Sunita V. Deshpande',
    role: 'institution_admin',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    department: 'Office of the Dean (Academic Affairs)',
    verified: true
  },
  staff: {
    id: 'user-staff-coep',
    email: 'admissions.officer@coeptech.ac.in',
    fullName: 'Rajesh K. Sharma',
    role: 'staff',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    department: 'Central Admissions Cell',
    verified: true
  },
  student: {
    id: 'user-student-01',
    email: 'aarav.sharma.ug25@coeptech.ac.in',
    fullName: 'Aarav Sharma',
    role: 'student',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    department: 'Computer Engineering & IT',
    studentId: 'stud-coep-001',
    verified: true
  },
  platform_admin: {
    id: 'user-platform-admin',
    email: 'oversight.aicte@nic.in',
    fullName: 'Prof. Anirudh Sen',
    role: 'platform_admin',
    department: 'National Academic Depository & AICTE Data Oversight Cell',
    verified: true
  }
};

// Initial verified sample records for demonstration
const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stud-coep-001',
    studentName: 'Aarav Sharma',
    apaarMasked: '••••-••••-8192',
    apaarHmac: 'hmac_7b8a912f8e1245',
    dob: '2005-06-14',
    gender: 'Male',
    rollNumber: 'CE-2025-014',
    registrationNo: 'COEP/2025/UG/1041',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    programmeId: 'prog-coep-cse',
    programmeName: 'B.Tech in Computer Engineering',
    academicYear: '2025-26',
    admissionDate: '2025-07-28',
    admissionCategory: 'OPEN',
    admissionQuota: 'Merit / State CET',
    enrolmentStatus: 'active',
    verificationStatus: 'format_valid',
    verificationNotes: 'APAAR 12-digit format verified against state admission merit list. Official external API verification pending gateway token.',
    email: 'aarav.sharma.ug25@coeptech.ac.in',
    phoneMasked: '+91-98••••••12',
    archived: false,
    documentsCount: 3,
    qrToken: 'apaar_qr_7b8a912f8e1245001122334455667788',
    qrIssuedAt: '2025-08-01T10:30:00Z',
    qrStatus: 'active',
    createdAt: '2025-08-01T10:30:00Z',
    updatedAt: '2025-08-01T10:30:00Z'
  },
  {
    id: 'stud-coep-002',
    studentName: 'Pooja Venkatesh',
    apaarMasked: '••••-••••-3419',
    apaarHmac: 'hmac_3a1c8f9024b11e',
    dob: '2005-09-22',
    gender: 'Female',
    rollNumber: 'CE-2025-042',
    registrationNo: 'COEP/2025/UG/1042',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    programmeId: 'prog-coep-cse',
    programmeName: 'B.Tech in Computer Engineering',
    academicYear: '2025-26',
    admissionDate: '2025-07-29',
    admissionCategory: 'OBC-NCL',
    admissionQuota: 'Merit / State CET',
    enrolmentStatus: 'active',
    verificationStatus: 'officially_verified',
    verificationNotes: 'APAAR verified via DigiLocker / ABC API Setu connector sandbox.',
    email: 'pooja.v.ug25@coeptech.ac.in',
    phoneMasked: '+91-97••••••45',
    archived: false,
    documentsCount: 4,
    qrToken: 'apaar_qr_3a1c8f9024b11e001122334455667788',
    qrIssuedAt: '2025-08-02T11:15:00Z',
    qrStatus: 'active',
    createdAt: '2025-08-02T11:15:00Z',
    updatedAt: '2025-08-02T11:15:00Z'
  },
  {
    id: 'stud-coep-003',
    studentName: 'Rohan Deshmukh',
    apaarMasked: '••••-••••-9041',
    apaarHmac: 'hmac_9041cd88e219aa',
    dob: '2004-11-05',
    gender: 'Male',
    rollNumber: 'ETC-2025-018',
    registrationNo: 'COEP/2025/UG/2018',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    programmeId: 'prog-coep-ece',
    programmeName: 'B.Tech in Electronics & Telecommunication',
    academicYear: '2025-26',
    admissionDate: '2025-08-02',
    admissionCategory: 'EWS',
    admissionQuota: 'Merit / State CET',
    enrolmentStatus: 'active',
    verificationStatus: 'validation_issues',
    verificationNotes: 'Secondary certificate name mismatch detected during preliminary validation.',
    email: 'rohan.d.ug25@coeptech.ac.in',
    phoneMasked: '+91-94••••••89',
    hasCorrectionRequest: true,
    correctionRequestNote: 'Please re-submit Class 12 / HSC marksheet matching exact spelling of middle name.',
    archived: false,
    documentsCount: 2,
    qrToken: 'apaar_qr_9041cd88e219aa001122334455667788',
    qrIssuedAt: '2025-08-03T09:45:00Z',
    qrStatus: 'active',
    createdAt: '2025-08-03T09:45:00Z',
    updatedAt: '2025-08-03T14:20:00Z'
  }
];

const INITIAL_FINDINGS: ValidationFinding[] = [
  {
    id: 'find-001',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    studentId: 'stud-coep-003',
    studentName: 'Rohan Deshmukh',
    apaarMasked: '••••-••••-9041',
    issueCategory: 'Inconsistent Enrolment Dates',
    severity: 'medium',
    explanation: 'Admission date (2025-08-02) is recorded post the institutional semester cut-off date without exemption endorsement.',
    evidence: 'Semester commencement date: 2025-07-25. Cut-off timestamp: 2025-07-31 23:59 IST.',
    detectedAt: '2025-08-03T14:20:00Z',
    status: 'open'
  }
];

const INITIAL_AUDIT: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '2025-08-01T10:30:00Z',
    actorName: 'Dr. Sunita V. Deshpande',
    actorEmail: 'dean.academics@coeptech.ac.in',
    actorRole: 'institution_admin',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    actionType: 'STUDENT_CREATED',
    entityType: 'student',
    entityId: 'stud-coep-001',
    summary: 'Created initial verified enrolment for Aarav Sharma (Roll: CE-2025-014) with masked APAAR ••••-••••-8192'
  },
  {
    id: 'aud-002',
    timestamp: '2025-08-02T11:15:00Z',
    actorName: 'Rajesh K. Sharma',
    actorEmail: 'admissions.officer@coeptech.ac.in',
    actorRole: 'staff',
    institutionId: 'inst-coep-01',
    institutionName: 'College of Engineering, Pune (COEP Technological University)',
    actionType: 'VERIFICATION_CHECK_EXECUTED',
    entityType: 'student',
    entityId: 'stud-coep-002',
    summary: 'Ran automated APAAR verification check for Pooja Venkatesh (Roll: CE-2025-042). Result: Officially Verified.'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    timestamp: '2025-08-03T14:20:00Z',
    title: 'Correction Requested on Student Record',
    message: 'Validation finding flagged on Rohan Deshmukh (ETC-2025-018) for Inconsistent Enrolment Dates.',
    type: 'warning',
    targetRole: 'staff',
    institutionId: 'inst-coep-01',
    read: false,
    linkTab: 'validation'
  },
  {
    id: 'notif-002',
    timestamp: '2025-08-01T09:00:00Z',
    title: 'AICTE EoA Approval Synchronized',
    message: 'Official AICTE Extension of Approval records for AY 2025-26 updated successfully.',
    type: 'info',
    targetRole: 'all',
    institutionId: 'inst-coep-01',
    read: true,
    linkTab: 'intake'
  }
];

class AppStore {
  private currentUser: UserProfile;
  private activeInstitutionId: string;
  private activeAcademicYear: string;
  private listeners: Array<() => void> = [];

  constructor() {
    this.currentUser = this.loadFromStorage(STORAGE_KEYS.CURRENT_USER, DEMO_USERS.institution_admin);
    this.activeInstitutionId = this.loadFromStorage(STORAGE_KEYS.ACTIVE_INSTITUTION_ID, 'inst-coep-01');
    this.activeAcademicYear = this.loadFromStorage(STORAGE_KEYS.ACTIVE_ACADEMIC_YEAR, '2025-26');
    this.initDefaults();
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save to localStorage (${key}):`, e);
    }
  }

  private initDefaults(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.INSTITUTIONS)) {
      this.saveToStorage(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROGRAMMES)) {
      this.saveToStorage(STORAGE_KEYS.PROGRAMMES, INITIAL_PROGRAMMES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.saveToStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FINDINGS)) {
      this.saveToStorage(STORAGE_KEYS.FINDINGS, INITIAL_FINDINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      this.saveToStorage(STORAGE_KEYS.AUDIT, INITIAL_AUDIT);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.IMPORT_BATCHES)) {
      this.saveToStorage(STORAGE_KEYS.IMPORT_BATCHES, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DUPLICATES)) {
      this.saveToStorage(STORAGE_KEYS.DUPLICATES, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPORTS)) {
      this.saveToStorage(STORAGE_KEYS.EXPORTS, []);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  // --- Auth & User State ---
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile): void {
    this.currentUser = user;
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    if (user.institutionId) {
      this.setActiveInstitutionId(user.institutionId);
    }
    this.notify();
  }

  public switchRole(role: UserRole): void {
    const demoProfile = DEMO_USERS[role];
    this.setCurrentUser(demoProfile);
    this.logAudit({
      actionType: 'MEMBERSHIP_UPDATED',
      entityType: 'institution',
      entityId: demoProfile.institutionId || 'system',
      summary: `User session switched to role: ${role} (${demoProfile.fullName})`
    });
  }

  public getActiveInstitutionId(): string {
    return this.activeInstitutionId;
  }

  public setActiveInstitutionId(id: string): void {
    this.activeInstitutionId = id;
    this.saveToStorage(STORAGE_KEYS.ACTIVE_INSTITUTION_ID, id);
    this.notify();
  }

  public getActiveAcademicYear(): string {
    return this.activeAcademicYear;
  }

  public setActiveAcademicYear(year: string): void {
    this.activeAcademicYear = year;
    this.saveToStorage(STORAGE_KEYS.ACTIVE_ACADEMIC_YEAR, year);
    this.notify();
  }

  // --- Institutions ---
  public getInstitutions(): Institution[] {
    return this.loadFromStorage(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
  }

  public getInstitutionById(id: string): Institution | undefined {
    return this.getInstitutions().find((i) => i.id === id);
  }

  public updateInstitutionClaim(institutionId: string, status: 'verified_active' | 'claim_pending'): void {
    const list = this.getInstitutions().map((i) => (i.id === institutionId ? { ...i, claimStatus: status } : i));
    this.saveToStorage(STORAGE_KEYS.INSTITUTIONS, list);
    this.logAudit({
      actionType: status === 'verified_active' ? 'CLAIM_APPROVED' : 'CLAIM_SUBMITTED',
      entityType: 'institution',
      entityId: institutionId,
      summary: `Institution claim status changed to ${status} for ID: ${institutionId}`
    });
    this.notify();
  }

  // --- Programmes ---
  public getProgrammes(institutionId?: string): Programme[] {
    const list = this.loadFromStorage<Programme[]>(STORAGE_KEYS.PROGRAMMES, INITIAL_PROGRAMMES);
    if (institutionId) {
      return list.filter((p) => p.institutionId === institutionId);
    }
    return list;
  }

  public addProgramme(prog: Omit<Programme, 'id' | 'lastUpdated'>): Programme {
    const newProg: Programme = {
      ...prog,
      id: `prog-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    const list = this.getProgrammes();
    list.push(newProg);
    this.saveToStorage(STORAGE_KEYS.PROGRAMMES, list);
    this.logAudit({
      actionType: 'PROGRAMME_CREATED',
      entityType: 'programme',
      entityId: newProg.id,
      summary: `Created programme ${newProg.name} (${newProg.code}) with approved intake ${newProg.approvedIntake}`
    });
    this.notify();
    return newProg;
  }

  // --- Students ---
  private getStoredStudents(): StudentRecord[] {
    const list = this.loadFromStorage<StudentRecord[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    let changed = false;
    const migrated = list.map((s) => {
      let updated = { ...s };
      if (!updated.qrToken) {
        changed = true;
        updated.qrToken = generateSecureQrToken();
      }
      if (!updated.qrIssuedAt) {
        changed = true;
        updated.qrIssuedAt = updated.createdAt || new Date().toISOString();
      }
      if (!updated.qrStatus) {
        changed = true;
        updated.qrStatus = (updated.enrolmentStatus === 'discontinued' ? 'revoked' : 'active') as 'active' | 'revoked';
      }
      return updated;
    });

    if (changed) {
      this.saveToStorage(STORAGE_KEYS.STUDENTS, migrated);
    }
    return migrated;
  }

  public getStudents(filterArchived: boolean = true): StudentRecord[] {
    const list = this.getStoredStudents();
    const user = this.currentUser;

    // Student role can only see their own record
    if (user.role === 'student' && user.studentId) {
      return list.filter((s) => s.id === user.studentId && (!filterArchived || !s.archived));
    }

    // Institution roles can only see their authorized institution
    if (user.role === 'staff' || user.role === 'institution_admin') {
      const instId = user.institutionId || this.activeInstitutionId;
      return list.filter((s) => s.institutionId === instId && (!filterArchived || !s.archived));
    }

    // Platform admin sees all
    return filterArchived ? list.filter((s) => !s.archived) : list;
  }

  public getStudentById(id: string): StudentRecord | undefined {
    const list = this.getStoredStudents();
    return list.find((s) => s.id === id);
  }

  public async addStudent(data: {
    studentName: string;
    rawApaar: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    rollNumber: string;
    registrationNo: string;
    institutionId: string;
    programmeId: string;
    academicYear: string;
    admissionDate: string;
    admissionCategory: StudentRecord['admissionCategory'];
    admissionQuota: StudentRecord['admissionQuota'];
    email: string;
    phoneMasked: string;
  }): Promise<{ student: StudentRecord; findings: ValidationFinding[] }> {
    const formatCheck = validateApaarFormat(data.rawApaar);
    const apaarMasked = formatCheck.masked;
    const apaarHmac = await computeApaarHmac(data.rawApaar);

    const institution = this.getInstitutionById(data.institutionId);
    const programmes = this.getProgrammes(data.institutionId);
    const programme = programmes.find((p) => p.id === data.programmeId);

    const newStudent: StudentRecord = {
      id: `stud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentName: data.studentName.trim(),
      apaarMasked,
      apaarHmac,
      dob: data.dob,
      gender: data.gender,
      rollNumber: data.rollNumber.trim(),
      registrationNo: data.registrationNo.trim(),
      institutionId: data.institutionId,
      institutionName: institution ? institution.name : 'Unknown Institution',
      programmeId: data.programmeId,
      programmeName: programme ? programme.name : 'Unknown Programme',
      academicYear: data.academicYear,
      admissionDate: data.admissionDate,
      admissionCategory: data.admissionCategory,
      admissionQuota: data.admissionQuota,
      enrolmentStatus: 'active',
      verificationStatus: formatCheck.isValid ? 'format_valid' : 'validation_issues',
      verificationNotes: formatCheck.isValid
        ? 'APAAR 12-digit format valid. Official external identity verification pending gateway authorization.'
        : `Format validation issues: ${formatCheck.errors.join('; ')}`,
      email: data.email.trim(),
      phoneMasked: data.phoneMasked || '+91-••••••••••',
      archived: false,
      documentsCount: 1,
      qrToken: generateSecureQrToken(),
      qrIssuedAt: new Date().toISOString(),
      qrStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allStudents = this.getStoredStudents();
    allStudents.unshift(newStudent);
    this.saveToStorage(STORAGE_KEYS.STUDENTS, allStudents);

    // Run deterministic validation & duplicate checks
    const findings: ValidationFinding[] = [];
    if (!formatCheck.isValid) {
      findings.push({
        id: `find-${Date.now()}-fmt`,
        institutionId: newStudent.institutionId,
        institutionName: newStudent.institutionName,
        studentId: newStudent.id,
        studentName: newStudent.studentName,
        apaarMasked: newStudent.apaarMasked,
        issueCategory: 'Invalid APAAR Format',
        severity: 'high',
        explanation: formatCheck.errors.join('; '),
        evidence: `Input failed structural validation: ${formatCheck.errors.join(', ')}`,
        detectedAt: new Date().toISOString(),
        status: 'open'
      });
    }

    // Check duplicate APAAR HMAC in database
    const matchingDuplicates = allStudents.filter(
      (s) => s.id !== newStudent.id && s.apaarHmac === apaarHmac && !s.archived
    );
    if (matchingDuplicates.length > 0) {
      const match = matchingDuplicates[0];
      const dupCandidate: DuplicateCandidate = {
        id: `dup-${Date.now()}`,
        institutionId: newStudent.institutionId,
        institutionName: newStudent.institutionName,
        studentA: {
          id: newStudent.id,
          name: newStudent.studentName,
          apaarMasked: newStudent.apaarMasked,
          institution: newStudent.institutionName,
          programme: newStudent.programmeName,
          academicYear: newStudent.academicYear,
          admissionDate: newStudent.admissionDate
        },
        studentB: {
          id: match.id,
          name: match.studentName,
          apaarMasked: match.apaarMasked,
          institution: match.institutionName,
          programme: match.programmeName,
          academicYear: match.academicYear,
          admissionDate: match.admissionDate
        },
        matchReason: `Keyed HMAC collision detected between current submission and existing record (Roll: ${match.rollNumber})`,
        matchType: 'Deterministic Identifier Hash',
        confidenceScore: 100,
        detectedAt: new Date().toISOString(),
        status: 'pending_review'
      };
      this.addDuplicateCandidate(dupCandidate);
    }

    // Save any findings
    if (findings.length > 0) {
      const existingFindings = this.getValidationFindings();
      this.saveToStorage(STORAGE_KEYS.FINDINGS, [...findings, ...existingFindings]);
    }

    this.logAudit({
      actionType: 'STUDENT_CREATED',
      entityType: 'student',
      entityId: newStudent.id,
      summary: `Created student record for ${newStudent.studentName} (${newStudent.rollNumber}) in ${newStudent.programmeName}`
    });

    this.notify();
    return { student: newStudent, findings };
  }

  public updateStudent(id: string, updates: Partial<StudentRecord>): void {
    const list = this.getStoredStudents();
    const index = list.findIndex((s) => s.id === id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(STORAGE_KEYS.STUDENTS, list);
      this.logAudit({
        actionType: 'STUDENT_UPDATED',
        entityType: 'student',
        entityId: id,
        summary: `Updated student record for ${list[index].studentName} (${list[index].rollNumber})`
      });
      this.notify();
    }
  }

  public requestStudentCorrection(id: string, note: string): void {
    const student = this.getStudentById(id);
    if (!student) return;
    this.updateStudent(id, {
      hasCorrectionRequest: true,
      correctionRequestNote: note,
      verificationStatus: 'awaiting_correction'
    });
    this.addNotification({
      title: 'Correction Requested',
      message: `Correction requested for ${student.studentName}: "${note}"`,
      type: 'warning',
      targetRole: 'student',
      institutionId: student.institutionId,
      linkTab: 'student_directory'
    });
  }

  public archiveStudent(id: string, reason: string): void {
    const student = this.getStudentById(id);
    if (!student) return;
    this.updateStudent(id, { archived: true });
    this.logAudit({
      actionType: 'STUDENT_ARCHIVED',
      entityType: 'student',
      entityId: id,
      summary: `Archived record for ${student.studentName} (${student.rollNumber}). Reason: ${reason}`
    });
  }

  // --- Validation Findings ---
  public getValidationFindings(): ValidationFinding[] {
    const list = this.loadFromStorage<ValidationFinding[]>(STORAGE_KEYS.FINDINGS, INITIAL_FINDINGS);
    const user = this.currentUser;
    if (user.role === 'staff' || user.role === 'institution_admin') {
      const instId = user.institutionId || this.activeInstitutionId;
      return list.filter((f) => f.institutionId === instId);
    }
    return list;
  }

  public resolveFinding(findingId: string, notes: string): void {
    const list = this.getValidationFindings().map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          status: 'resolved' as const,
          resolutionNotes: notes,
          resolvedAt: new Date().toISOString(),
          resolvedBy: this.currentUser.fullName
        };
      }
      return f;
    });
    this.saveToStorage(STORAGE_KEYS.FINDINGS, list);
    this.logAudit({
      actionType: 'VALIDATION_RESOLVED',
      entityType: 'validation_finding',
      entityId: findingId,
      summary: `Resolved validation finding ${findingId} with note: "${notes}"`
    });
    this.notify();
  }

  public dismissFinding(findingId: string, reason: string): void {
    const list = this.getValidationFindings().map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          status: 'dismissed' as const,
          resolutionNotes: reason,
          resolvedAt: new Date().toISOString(),
          resolvedBy: this.currentUser.fullName
        };
      }
      return f;
    });
    this.saveToStorage(STORAGE_KEYS.FINDINGS, list);
    this.notify();
  }

  // --- Duplicate Candidates ---
  public getDuplicateCandidates(): DuplicateCandidate[] {
    const list = this.loadFromStorage<DuplicateCandidate[]>(STORAGE_KEYS.DUPLICATES, []);
    const user = this.currentUser;
    if (user.role === 'staff' || user.role === 'institution_admin') {
      const instId = user.institutionId || this.activeInstitutionId;
      return list.filter((d) => d.institutionId === instId);
    }
    return list;
  }

  public addDuplicateCandidate(candidate: DuplicateCandidate): void {
    const list = this.getDuplicateCandidates();
    list.unshift(candidate);
    this.saveToStorage(STORAGE_KEYS.DUPLICATES, list);
    this.addNotification({
      title: 'Potential Duplicate Enrolment Flagged',
      message: `Deterministic match detected for ${candidate.studentA.name} and ${candidate.studentB.name}`,
      type: 'alert',
      targetRole: 'institution_admin',
      institutionId: candidate.institutionId,
      linkTab: 'duplicates'
    });
    this.notify();
  }

  public decideDuplicate(candidateId: string, decision: DuplicateCandidate['status'], notes: string): void {
    const list = this.getDuplicateCandidates().map((d) => {
      if (d.id === candidateId) {
        return {
          ...d,
          status: decision,
          reviewDecision: notes,
          reviewedBy: this.currentUser.fullName,
          reviewedAt: new Date().toISOString()
        };
      }
      return d;
    });
    this.saveToStorage(STORAGE_KEYS.DUPLICATES, list);
    this.logAudit({
      actionType: 'DUPLICATE_DECIDED',
      entityType: 'duplicate_candidate',
      entityId: candidateId,
      summary: `Review decision for duplicate candidate ${candidateId}: ${decision} - "${notes}"`
    });
    this.notify();
  }

  // --- Import Batches ---
  public getImportBatches(): ImportBatch[] {
    const list = this.loadFromStorage<ImportBatch[]>(STORAGE_KEYS.IMPORT_BATCHES, []);
    const user = this.currentUser;
    if (user.role === 'staff' || user.role === 'institution_admin') {
      const instId = user.institutionId || this.activeInstitutionId;
      return list.filter((b) => b.institutionId === instId);
    }
    return list;
  }

  public addImportBatch(batch: ImportBatch): void {
    const list = this.getImportBatches();
    list.unshift(batch);
    this.saveToStorage(STORAGE_KEYS.IMPORT_BATCHES, list);
    this.logAudit({
      actionType: 'BATCH_IMPORTED',
      entityType: 'import_batch',
      entityId: batch.id,
      summary: `Imported batch ${batch.filename}: ${batch.validRows} valid rows inserted, ${batch.invalidRows} flagged.`
    });
    this.addNotification({
      title: 'Batch Import Completed',
      message: `${batch.filename} processed: ${batch.validRows} students imported, ${batch.invalidRows} issues flagged.`,
      type: batch.invalidRows > 0 ? 'warning' : 'success',
      targetRole: 'staff',
      institutionId: batch.institutionId,
      linkTab: 'import_history'
    });
    this.notify();
  }

  // --- Audit Trail ---
  public getAuditEvents(): AuditEvent[] {
    const list = this.loadFromStorage<AuditEvent[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT);
    const user = this.currentUser;
    if (user.role === 'staff' || user.role === 'institution_admin') {
      const instId = user.institutionId || this.activeInstitutionId;
      return list.filter((a) => !a.institutionId || a.institutionId === instId);
    }
    return list;
  }

  public logAudit(event: {
    actionType: AuditEvent['actionType'];
    entityType: AuditEvent['entityType'];
    entityId: string;
    summary: string;
    metadata?: Record<string, string | number | boolean>;
  }): void {
    const fullEvent: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: this.currentUser.fullName,
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      institutionId: this.currentUser.institutionId || this.activeInstitutionId,
      institutionName: this.currentUser.institutionName,
      actionType: event.actionType,
      entityType: event.entityType,
      entityId: event.entityId,
      summary: event.summary,
      metadata: event.metadata
    };
    const list = this.loadFromStorage<AuditEvent[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT);
    list.unshift(fullEvent);
    this.saveToStorage(STORAGE_KEYS.AUDIT, list);
    this.notify();
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    const list = this.loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const user = this.currentUser;
    return list.filter((n) => {
      if (n.targetRole && n.targetRole !== 'all' && n.targetRole !== user.role) return false;
      if (n.institutionId && user.institutionId && n.institutionId !== user.institutionId) return false;
      return true;
    });
  }

  public addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    const list = this.loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.unshift(newNotif);
    this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    this.notify();
  }

  public markNotificationRead(id: string): void {
    const list = this.loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    this.notify();
  }

  // --- Exports ---
  public getExportHistory(): ExportHistoryRecord[] {
    return this.loadFromStorage<ExportHistoryRecord[]>(STORAGE_KEYS.EXPORTS, []);
  }

  public logExport(reportType: string, format: 'PDF' | 'CSV', count: number): void {
    const inst = this.getInstitutionById(this.activeInstitutionId);
    const rec: ExportHistoryRecord = {
      id: `exp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail: this.currentUser.email,
      reportType,
      institutionName: inst ? inst.name : 'All Institutions',
      academicYear: this.activeAcademicYear,
      format,
      recordCount: count,
      status: 'Completed'
    };
    const list = this.getExportHistory();
    list.unshift(rec);
    this.saveToStorage(STORAGE_KEYS.EXPORTS, list);
    this.logAudit({
      actionType: 'REPORT_EXPORTED',
      entityType: 'report',
      entityId: rec.id,
      summary: `Exported ${reportType} report in ${format} format (${count} records)`
    });
    this.notify();
  }

  // --- CSV Export Helper ---
  public exportStudentsCsv(): string {
    const students = this.getStudents();
    const headers = [
      'Record ID',
      'Student Name',
      'Masked APAAR ID',
      'Roll Number',
      'Registration No',
      'Programme',
      'Academic Year',
      'Admission Date',
      'Category',
      'Quota',
      'Enrolment Status',
      'Verification Status'
    ];

    const rows = students.map((s) => [
      sanitizeForCsv(s.id),
      sanitizeForCsv(s.studentName),
      sanitizeForCsv(s.apaarMasked),
      sanitizeForCsv(s.rollNumber),
      sanitizeForCsv(s.registrationNo),
      sanitizeForCsv(s.programmeName),
      sanitizeForCsv(s.academicYear),
      sanitizeForCsv(s.admissionDate),
      sanitizeForCsv(s.admissionCategory),
      sanitizeForCsv(s.admissionQuota),
      sanitizeForCsv(s.enrolmentStatus),
      sanitizeForCsv(s.verificationStatus)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.logExport('Authorised Student Directory', 'CSV', students.length);
    return csvContent;
  }

  // --- Student QR Identity & Verification Methods ---
  public getStudentByQrToken(token: string): StudentRecord | undefined {
    if (!token) return undefined;
    const allStudents = this.getStoredStudents();
    return allStudents.find((s) => s.qrToken === token);
  }

  public revokeStudentQr(studentId: string, reason: string): void {
    const list = this.getStoredStudents();
    const index = list.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        qrStatus: 'revoked',
        qrRevokedAt: new Date().toISOString(),
        qrRevokedReason: reason,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(STORAGE_KEYS.STUDENTS, list);
      this.logAudit({
        actionType: 'QR_REVOKED',
        entityType: 'qr_identity',
        entityId: studentId,
        summary: `Revoked Student QR Identity Card for ${list[index].studentName} (${list[index].rollNumber}). Reason: ${reason}`
      });
      this.addNotification({
        title: 'Student QR Identity Revoked',
        message: `QR code for ${list[index].studentName} (${list[index].rollNumber}) was revoked: ${reason}`,
        type: 'alert',
        targetRole: 'staff',
        institutionId: list[index].institutionId,
        linkTab: 'qr_identity'
      });
      this.notify();
    }
  }

  public reissueStudentQr(studentId: string, reason: string): string {
    const list = this.getStoredStudents();
    const index = list.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      const newToken = generateSecureQrToken();
      list[index] = {
        ...list[index],
        qrToken: newToken,
        qrIssuedAt: new Date().toISOString(),
        qrStatus: 'active',
        qrRevokedAt: undefined,
        qrRevokedReason: undefined,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(STORAGE_KEYS.STUDENTS, list);
      this.logAudit({
        actionType: 'QR_REISSUED',
        entityType: 'qr_identity',
        entityId: studentId,
        summary: `Reissued new cryptographic Student QR Identity Card for ${list[index].studentName} (${list[index].rollNumber}). Reason: ${reason}`
      });
      this.addNotification({
        title: 'New Student QR Identity Reissued',
        message: `New QR token generated for ${list[index].studentName}. Previous card permanently invalidated.`,
        type: 'info',
        targetRole: 'staff',
        institutionId: list[index].institutionId,
        linkTab: 'qr_identity'
      });
      this.notify();
      return newToken;
    }
    return '';
  }

  public logQrVerificationScan(studentId: string, viewerRole: string = 'public_verifier'): void {
    const student = this.getStudentById(studentId);
    this.logAudit({
      actionType: 'QR_VERIFIED',
      entityType: 'qr_identity',
      entityId: studentId,
      summary: `Mobile QR instant verification scan executed for ${student ? student.studentName : studentId} (Access level: ${viewerRole})`
    });
  }
}

export const appStore = new AppStore();
