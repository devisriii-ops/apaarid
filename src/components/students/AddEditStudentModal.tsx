import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { StudentRecord, AdmissionCategory, Programme } from '../../types';
import { validateApaarFormat } from '../../utils/apaarCrypto';
import { appStore } from '../../services/store';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: StudentRecord | null;
  onSaved: () => void;
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
  onSaved
}) => {
  const currentUser = appStore.getCurrentUser();
  const instId = currentUser.institutionId || appStore.getActiveInstitutionId();
  const programmes = appStore.getProgrammes(instId);
  const activeYear = appStore.getActiveAcademicYear();

  const [studentName, setStudentName] = useState('');
  const [rawApaar, setRawApaar] = useState('');
  const [dob, setDob] = useState('2005-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [rollNumber, setRollNumber] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [programmeId, setProgrammeId] = useState(programmes[0]?.id || '');
  const [academicYear, setAcademicYear] = useState(activeYear);
  const [admissionDate, setAdmissionDate] = useState('2025-07-28');
  const [admissionCategory, setAdmissionCategory] = useState<AdmissionCategory>('OPEN');
  const [admissionQuota, setAdmissionQuota] = useState<StudentRecord['admissionQuota']>('Merit / State CET');
  const [email, setEmail] = useState('');
  const [phoneMasked, setPhoneMasked] = useState('+91-9876543210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (studentToEdit) {
      setStudentName(studentToEdit.studentName);
      setRawApaar(studentToEdit.apaarMasked.replace(/[^0-9]/g, '').padStart(12, '1'));
      setDob(studentToEdit.dob);
      setGender(studentToEdit.gender);
      setRollNumber(studentToEdit.rollNumber);
      setRegistrationNo(studentToEdit.registrationNo);
      setProgrammeId(studentToEdit.programmeId);
      setAcademicYear(studentToEdit.academicYear);
      setAdmissionDate(studentToEdit.admissionDate);
      setAdmissionCategory(studentToEdit.admissionCategory);
      setAdmissionQuota(studentToEdit.admissionQuota);
      setEmail(studentToEdit.email);
      setPhoneMasked(studentToEdit.phoneMasked);
    } else {
      setStudentName('');
      setRawApaar('123456789012');
      setRollNumber(`ROLL-${Date.now().toString().slice(-4)}`);
      setRegistrationNo(`REG-${Date.now().toString().slice(-5)}`);
      setEmail('');
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  // Real-time format validation test
  const apaarTest = validateApaarFormat(rawApaar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('Student name is required.');
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMsg('Roll / Seat number is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (studentToEdit) {
        appStore.updateStudent(studentToEdit.id, {
          studentName: studentName.trim(),
          dob,
          gender,
          rollNumber: rollNumber.trim(),
          registrationNo: registrationNo.trim(),
          programmeId,
          academicYear,
          admissionDate,
          admissionCategory,
          admissionQuota,
          email: email.trim(),
          phoneMasked
        });
      } else {
        await appStore.addStudent({
          studentName: studentName.trim(),
          rawApaar,
          dob,
          gender,
          rollNumber: rollNumber.trim(),
          registrationNo: registrationNo.trim(),
          institutionId: instId,
          programmeId,
          academicYear,
          admissionDate,
          admissionCategory,
          admissionQuota,
          email: email.trim() || `${studentName.toLowerCase().replace(/\s+/g, '.')}@student.ac.in`,
          phoneMasked
        });
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save student record';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9BAAA0] hover:text-[#F2F6F0] p-1.5 rounded-lg hover:bg-[#123D2A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            {studentToEdit ? 'Modify Existing Enrolment' : 'New Institutional Enrolment Submission'}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            {studentToEdit ? `Edit Record: ${studentToEdit.studentName}` : 'Add Student Enrolment Record'}
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            All student submissions are validated against institutional eligibility criteria and AICTE intake limits.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Full Name of Student (as per SSC / Matric) *
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Vikramaditya Patil"
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                APAAR ID (12-Digit Identifier) *
              </label>
              <input
                type="text"
                maxLength={14}
                required
                disabled={!!studentToEdit}
                value={rawApaar}
                onChange={(e) => setRawApaar(e.target.value)}
                placeholder="123456789012"
                className="w-full px-3 py-2 text-xs font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
              <div className="mt-1 flex items-center justify-between text-[11px]">
                {apaarTest.isValid ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" /> Valid 12-digit format ({apaarTest.masked})
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono text-[10px]">
                    {apaarTest.errors[0] || '12 digits required'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Admission Date *
              </label>
              <input
                type="date"
                required
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Roll Number / PRN *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. CE-2025-055"
                className="w-full px-3 py-2 text-xs font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Institutional Registration No
              </label>
              <input
                type="text"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="e.g. COEP/2025/UG/1055"
                className="w-full px-3 py-2 text-xs font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Academic Programme *
              </label>
              <select
                value={programmeId}
                onChange={(e) => setProgrammeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code}) — Intake: {p.approvedIntake}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Academic Year *
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Admission Category *
              </label>
              <select
                value={admissionCategory}
                onChange={(e) => setAdmissionCategory(e.target.value as AdmissionCategory)}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="OPEN">OPEN / General</option>
                <option value="OBC-NCL">OBC-NCL</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="PWD">PWD (Persons with Disability)</option>
                <option value="TFW">TFW (Tuition Fee Waiver)</option>
                <option value="NRI/PIO">NRI / PIO Quota</option>
                <option value="MANAGEMENT">Management / Institutional Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Admission Quota Type *
              </label>
              <select
                value={admissionQuota}
                onChange={(e) => setAdmissionQuota(e.target.value as StudentRecord['admissionQuota'])}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="Merit / State CET">Merit / State CET Centralised</option>
                <option value="Lateral Entry">Direct Second Year (Lateral Entry)</option>
                <option value="Management">Management Quota</option>
                <option value="Supernumerary / PMSSS">Supernumerary / PMSSS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Student Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@institution.ac.in"
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Phone Number (Masked for privacy)
              </label>
              <input
                type="text"
                value={phoneMasked}
                onChange={(e) => setPhoneMasked(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#123D2A] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#07110D] hover:bg-[#123D2A] text-[#9BAAA0] hover:text-[#F2F6F0] border border-[#123D2A] text-xs font-medium rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : studentToEdit ? 'Update Record' : 'Save & Verify Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
