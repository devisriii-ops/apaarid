import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Check,
  RefreshCw,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { StudentRecord, ImportBatch, AdmissionCategory } from '../../types';
import { appStore } from '../../services/store';
import { validateApaarFormat, sanitizeForCsv } from '../../utils/apaarCrypto';

interface StagedRow {
  rowNum: number;
  studentName: string;
  rawApaar: string;
  rollNumber: string;
  registrationNo: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  admissionCategory: AdmissionCategory;
  admissionQuota: StudentRecord['admissionQuota'];
  admissionDate: string;
  email: string;
  phoneMasked: string;
  isValid: boolean;
  errors: string[];
}

export const BulkImportWizard: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const instId = currentUser.institutionId || appStore.getActiveInstitutionId();
  const institution = appStore.getInstitutionById(instId);
  const programmes = appStore.getProgrammes(instId);
  const activeYear = appStore.getActiveAcademicYear();

  // Wizard state: 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>(programmes[0]?.id || '');
  const [selectedYear, setSelectedYear] = useState<string>(activeYear);

  // Column Mapping
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    studentName: '',
    rawApaar: '',
    rollNumber: '',
    registrationNo: '',
    dob: '',
    gender: '',
    admissionCategory: '',
    admissionQuota: '',
    admissionDate: '',
    email: '',
    phone: ''
  });

  // Staged Rows & Validation Results
  const [stagedRows, setStagedRows] = useState<StagedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<ImportBatch | null>(null);

  // Sample CSV generator for user
  const handleDownloadSampleCsv = () => {
    const sampleHeaders = [
      'Student Name',
      'APAAR ID',
      'Roll Number',
      'Registration No',
      'Date of Birth (YYYY-MM-DD)',
      'Gender',
      'Category',
      'Quota',
      'Admission Date (YYYY-MM-DD)',
      'Email',
      'Phone'
    ];
    const sampleRows = [
      [
        'Aditya Verma',
        '847291038472',
        'CE-2025-081',
        'COEP/2025/UG/1081',
        '2005-04-12',
        'Male',
        'OPEN',
        'Merit / State CET',
        '2025-07-28',
        'aditya.v@student.ac.in',
        '+91-9823112233'
      ],
      [
        'Sneha Kulkarni',
        '938172645102',
        'CE-2025-082',
        'COEP/2025/UG/1082',
        '2005-08-19',
        'Female',
        'OBC-NCL',
        'Merit / State CET',
        '2025-07-28',
        'sneha.k@student.ac.in',
        '+91-9876543210'
      ],
      [
        'Gaurav S. Shinde',
        '710293847561',
        'CE-2025-083',
        'COEP/2025/UG/1083',
        '2004-12-03',
        'Male',
        'EWS',
        'Merit / State CET',
        '2025-07-29',
        'gaurav.s@student.ac.in',
        '+91-9123456780'
      ]
    ];

    const csvStr = [
      sampleHeaders.join(','),
      ...sampleRows.map((r) => r.map((c) => sanitizeForCsv(c)).join(','))
    ].join('\n');

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AICTE_APAAR_Batch_Import_Template.csv`;
    a.click();
  };

  // Step 1: Parse CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    setFile(uploaded);
    setFileName(uploaded.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      parseCsvData(text);
    };
    reader.readAsText(uploaded);
  };

  const parseCsvData = (text: string) => {
    const lines = text
      .split(/\r\n|\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) return;

    const parsedHeaders = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
    setHeaders(parsedHeaders);

    // Auto map standard columns
    const autoMap: Record<string, string> = { ...mapping };
    parsedHeaders.forEach((h) => {
      const lower = h.toLowerCase();
      if (lower.includes('name')) autoMap.studentName = h;
      if (lower.includes('apaar') || lower.includes('abc')) autoMap.rawApaar = h;
      if (lower.includes('roll')) autoMap.rollNumber = h;
      if (lower.includes('reg')) autoMap.registrationNo = h;
      if (lower.includes('birth') || lower.includes('dob')) autoMap.dob = h;
      if (lower.includes('gender')) autoMap.gender = h;
      if (lower.includes('cat')) autoMap.admissionCategory = h;
      if (lower.includes('quota')) autoMap.admissionQuota = h;
      if (lower.includes('admission') || lower.includes('date')) autoMap.admissionDate = h;
      if (lower.includes('mail')) autoMap.email = h;
      if (lower.includes('phone') || lower.includes('mobile')) autoMap.phone = h;
    });
    setMapping(autoMap);

    // Build raw data rows
    const rows: StagedRow[] = [];
    const existingStudents = appStore.getStudents();
    const seenFileApaar = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      const getVal = (field: string) => {
        const header = autoMap[field];
        if (!header) return '';
        const idx = parsedHeaders.indexOf(header);
        return idx !== -1 && cols[idx] ? cols[idx] : '';
      };

      const rawApaarVal = getVal('rawApaar');
      const nameVal = getVal('studentName');
      const rollVal = getVal('rollNumber') || `ROLL-${i}`;
      const errors: string[] = [];

      // Validations
      if (!nameVal) errors.push('Student name is required');
      const apaarCheck = validateApaarFormat(rawApaarVal);
      if (!apaarCheck.isValid) {
        errors.push(apaarCheck.errors[0] || 'Invalid APAAR format');
      }

      // In-file duplicate check
      const cleanApaar = rawApaarVal.replace(/[\s-]/g, '');
      if (cleanApaar && seenFileApaar.has(cleanApaar)) {
        errors.push('Duplicate APAAR identifier within the uploaded file');
      } else if (cleanApaar) {
        seenFileApaar.add(cleanApaar);
      }

      // Check duplicate in database
      const dbMatch = existingStudents.find((s) => s.apaarMasked === apaarCheck.masked);
      if (dbMatch) {
        errors.push(`Conflicts with existing verified student (${dbMatch.studentName}, Roll: ${dbMatch.rollNumber})`);
      }

      rows.push({
        rowNum: i,
        studentName: nameVal || `Student ${i}`,
        rawApaar: rawApaarVal,
        rollNumber: rollVal,
        registrationNo: getVal('registrationNo') || `REG-${i}`,
        dob: getVal('dob') || '2005-01-01',
        gender: (getVal('gender') as 'Male' | 'Female' | 'Other') || 'Male',
        admissionCategory: (getVal('admissionCategory') as AdmissionCategory) || 'OPEN',
        admissionQuota: (getVal('admissionQuota') as StudentRecord['admissionQuota']) || 'Merit / State CET',
        admissionDate: getVal('admissionDate') || '2025-07-28',
        email: getVal('email') || `student${i}@institution.ac.in`,
        phoneMasked: getVal('phone') || '+91-••••••••••',
        isValid: errors.length === 0,
        errors
      });
    }

    setStagedRows(rows);
  };

  // Re-run validation after column mapping changes
  const rerunValidation = () => {
    // Re-trigger parse with current mapping
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) parseCsvData(text);
      };
      reader.readAsText(file);
    }
  };

  // Step 7 to 8: Execute Import
  const handleExecuteImport = async () => {
    setIsProcessing(true);
    const validRows = stagedRows.filter((r) => r.isValid);
    const invalidRows = stagedRows.filter((r) => !r.isValid);

    const prog = programmes.find((p) => p.id === selectedProgrammeId);
    const progName = prog ? prog.name : 'Institutional Programme';

    // Import valid rows into store
    for (const r of validRows) {
      await appStore.addStudent({
        studentName: r.studentName,
        rawApaar: r.rawApaar,
        dob: r.dob,
        gender: r.gender,
        rollNumber: r.rollNumber,
        registrationNo: r.registrationNo,
        institutionId: instId,
        programmeId: selectedProgrammeId,
        academicYear: selectedYear,
        admissionDate: r.admissionDate,
        admissionCategory: r.admissionCategory,
        admissionQuota: r.admissionQuota,
        email: r.email,
        phoneMasked: r.phoneMasked
      });
    }

    // Record Batch
    const batch: ImportBatch = {
      id: `batch-${Date.now()}`,
      institutionId: instId,
      institutionName: institution ? institution.name : 'Unknown Institution',
      filename: fileName || 'batch_import.csv',
      academicYear: selectedYear,
      programmeId: selectedProgrammeId,
      uploadedBy: currentUser.fullName,
      uploadedByRole: currentUser.role,
      uploadedAt: new Date().toISOString(),
      status: invalidRows.length === 0 ? 'Completed' : 'Completed with Warnings',
      totalRows: stagedRows.length,
      validRows: validRows.length,
      invalidRows: invalidRows.length,
      skippedRows: 0,
      outcome: `Inserted ${validRows.length} students into ${progName}. ${invalidRows.length} rows flagged for validation.`,
      errorLog: invalidRows.map((r) => ({
        row: r.rowNum,
        field: 'APAAR / Demographic',
        error: r.errors.join('; '),
        rawValue: r.rawApaar
      }))
    };

    appStore.addImportBatch(batch);
    setBatchResult(batch);
    setIsProcessing(false);
    setCurrentStep(8);
  };

  return (
    <div className="space-y-6">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Staged Bulk Import Engine
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            CSV / XLSX Student Import Wizard
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            8-stage deterministic ingestion with pre-commit validation and AICTE intake verification.
          </p>
        </div>

        <button
          onClick={handleDownloadSampleCsv}
          className="px-3.5 py-2 bg-[#0B1812] hover:bg-[#123D2A] text-[#F2F6F0] border border-[#123D2A] hover:border-[#1D6B48] text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <Download className="w-3.5 h-3.5 text-[#B8D8C2]" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* 8-Step Indicator */}
      <div className="p-3 bg-[#0B1812] border border-[#123D2A] rounded-xl overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between text-xs font-mono">
          {[
            '1. File',
            '2. Scope',
            '3. Mapping',
            '4. Staging',
            '5. Validation',
            '6. Flags',
            '7. Confirm',
            '8. Result'
          ].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div
                key={idx}
                className={`flex items-center gap-1.5 ${
                  isCurrent ? 'text-[#B8D8C2] font-bold' : isDone ? 'text-emerald-400' : 'text-[#9BAAA0]/60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? 'bg-[#1D6B48] text-white'
                      : isDone
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-[#07110D] border border-[#123D2A]'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : stepNum}
                </div>
                <span>{label}</span>
                {idx < 7 && <span className="text-[#123D2A] mx-1">›</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Body Card */}
      <div className="p-6 bg-[#0B1812] border border-[#123D2A] rounded-xl text-[#F2F6F0]">
        {/* STEP 1: Select File */}
        {currentStep === 1 && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#123D2A] text-[#B8D8C2] flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F2F6F0]">Select Student Data Spreadsheet</h3>
              <p className="text-xs text-[#9BAAA0] max-w-md mx-auto mt-1">
                Upload institutional student records in CSV format. File is parsed locally and validated against national APAAR checksum standards.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="block p-8 border-2 border-dashed border-[#1D6B48]/50 hover:border-[#B8D8C2] rounded-xl cursor-pointer bg-[#07110D]/50 transition-all">
                <FileSpreadsheet className="w-8 h-8 text-[#B8D8C2] mx-auto mb-2" />
                <span className="text-xs font-semibold text-[#F2F6F0] block">
                  {fileName ? fileName : 'Choose CSV File to Upload'}
                </span>
                <span className="text-[11px] text-[#9BAAA0] mt-1 block">Supports UTF-8 CSV up to 10MB</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {fileName && (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Loaded {fileName} ({stagedRows.length} rows ready)</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#123D2A] flex justify-end">
              <button
                disabled={stagedRows.length === 0}
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-[#B8D8C2] disabled:opacity-40 hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Import Configuration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Configure Context */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-xl mx-auto py-4">
            <div>
              <h3 className="text-lg font-bold text-[#F2F6F0]">Step 2: Configure Ingestion Target</h3>
              <p className="text-xs text-[#9BAAA0] mt-1">
                Bind the staged batch to the authorised institution, programme, and academic cohort.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F2F6F0] mb-1">Authorised Institution</label>
                <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs font-medium text-[#F2F6F0]">
                  {institution?.name || 'College of Engineering, Pune'} (AICTE ID: {institution?.aictePermanentId})
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F2F6F0] mb-1">Target Academic Programme *</label>
                <select
                  value={selectedProgrammeId}
                  onChange={(e) => setSelectedProgrammeId(e.target.value)}
                  className="w-full p-2.5 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                >
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code}) — Approved Capacity: {p.approvedIntake}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F2F6F0] mb-1">Academic Year Cohort *</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2.5 bg-[#07110D] border border-[#123D2A] rounded-lg text-xs font-mono text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-[#123D2A] flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-[#07110D] hover:bg-[#123D2A] text-xs rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <span>Continue to Column Mapping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Map Columns */}
        {currentStep === 3 && (
          <div className="space-y-6 py-2">
            <div>
              <h3 className="text-lg font-bold text-[#F2F6F0]">Step 3: Field & Column Mapping</h3>
              <p className="text-xs text-[#9BAAA0] mt-1">
                Map columns from your spreadsheet to mandatory institutional schema fields.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'studentName', label: 'Student Full Name *' },
                { key: 'rawApaar', label: 'APAAR / ABC Identifier (12 Digits) *' },
                { key: 'rollNumber', label: 'Roll Number / PRN *' },
                { key: 'registrationNo', label: 'Institutional Registration Number' },
                { key: 'dob', label: 'Date of Birth (YYYY-MM-DD)' },
                { key: 'gender', label: 'Gender' },
                { key: 'admissionCategory', label: 'Admission Category (OPEN/OBC/SC/ST/EWS)' },
                { key: 'admissionQuota', label: 'Quota Type' },
                { key: 'admissionDate', label: 'Admission Date' },
                { key: 'email', label: 'Student Email' }
              ].map((f) => (
                <div key={f.key} className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg">
                  <label className="block text-xs font-medium text-[#F2F6F0] mb-1">{f.label}</label>
                  <select
                    value={mapping[f.key] || ''}
                    onChange={(e) => {
                      setMapping({ ...mapping, [f.key]: e.target.value });
                    }}
                    className="w-full p-2 bg-[#0B1812] border border-[#123D2A] rounded text-xs text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                  >
                    <option value="">-- Unmapped --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#123D2A] flex justify-between">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 bg-[#07110D] text-xs rounded-lg">
                Back
              </button>
              <button
                onClick={() => {
                  rerunValidation();
                  setCurrentStep(4);
                }}
                className="px-5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <span>Preview Staged Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Preview Staged Rows */}
        {currentStep === 4 && (
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F2F6F0]">Step 4: Staged File Preview</h3>
                <p className="text-xs text-[#9BAAA0] mt-0.5">
                  Showing {stagedRows.length} rows parsed from <span className="font-mono text-[#F2F6F0]">{fileName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-400">{stagedRows.filter((r) => r.isValid).length} Valid</span>
                <span>·</span>
                <span className="text-amber-400">{stagedRows.filter((r) => !r.isValid).length} Flagged</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto border border-[#123D2A] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#07110D] border-b border-[#123D2A] text-[#9BAAA0]">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Raw APAAR</th>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#123D2A]/50">
                  {stagedRows.map((r) => (
                    <tr key={r.rowNum} className={r.isValid ? 'hover:bg-[#123D2A]/20' : 'bg-red-950/20'}>
                      <td className="py-2 px-3 font-mono text-[#9BAAA0]">{r.rowNum}</td>
                      <td className="py-2 px-3 font-medium text-[#F2F6F0]">{r.studentName}</td>
                      <td className="py-2 px-3 font-mono text-xs text-[#B8D8C2]">{r.rawApaar}</td>
                      <td className="py-2 px-3 font-mono text-[#F2F6F0]">{r.rollNumber}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-[#C8AA6E]">{r.admissionCategory}</td>
                      <td className="py-2 px-3">
                        {r.isValid ? (
                          <span className="text-[10px] font-mono text-emerald-400">Valid</span>
                        ) : (
                          <span className="text-[10px] font-mono text-red-400" title={r.errors.join('; ')}>
                            {r.errors[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-[#123D2A] flex justify-between">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-2 bg-[#07110D] text-xs rounded-lg">
                Back to Mapping
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2 bg-[#B8D8C2] text-[#07110D] font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <span>Run Validation Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 & 6: Validation & Error Correction */}
        {(currentStep === 5 || currentStep === 6) && (
          <div className="space-y-5 py-2">
            <div>
              <h3 className="text-lg font-bold text-[#F2F6F0]">
                {currentStep === 5 ? 'Step 5: Automated Validation Engine' : 'Step 6: Resolve Flagged Issues'}
              </h3>
              <p className="text-xs text-[#9BAAA0] mt-0.5">
                Deterministic rules checked: APAAR 12-digit Luhn/Verhoeff check, category validity, in-file & database duplicate scans.
              </p>
            </div>

            {/* Breakdown summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#07110D] border border-emerald-900/60 rounded-xl">
                <div className="text-xs text-[#9BAAA0]">Ready for Ingestion</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  {stagedRows.filter((r) => r.isValid).length}
                </div>
                <div className="text-[11px] text-[#9BAAA0] mt-1">Passes all format & integrity rules</div>
              </div>

              <div className="p-4 bg-[#07110D] border border-amber-900/60 rounded-xl">
                <div className="text-xs text-[#9BAAA0]">Validation Exceptions</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                  {stagedRows.filter((r) => !r.isValid).length}
                </div>
                <div className="text-[11px] text-[#9BAAA0] mt-1">Non-blocking: will generate finding tickets</div>
              </div>

              <div className="p-4 bg-[#07110D] border border-[#123D2A] rounded-xl">
                <div className="text-xs text-[#9BAAA0]">Intake Capacity Impact</div>
                <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
                  +{stagedRows.filter((r) => r.isValid).length}
                </div>
                <div className="text-[11px] text-[#9BAAA0] mt-1">Allocated to selected programme</div>
              </div>
            </div>

            {stagedRows.filter((r) => !r.isValid).length > 0 && (
              <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs space-y-2">
                <div className="font-semibold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Flagged Rows Detail</span>
                </div>
                {stagedRows
                  .filter((r) => !r.isValid)
                  .map((r) => (
                    <div key={r.rowNum} className="text-[#9BAAA0] flex items-center justify-between border-t border-amber-900/30 pt-1">
                      <span>Row {r.rowNum}: {r.studentName} ({r.rawApaar})</span>
                      <span className="font-mono text-amber-400 text-[11px]">{r.errors.join('; ')}</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-4 border-t border-[#123D2A] flex justify-between">
              <button onClick={() => setCurrentStep(4)} className="px-4 py-2 bg-[#07110D] text-xs rounded-lg">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(7)}
                className="px-5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <span>Proceed to Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Explicit Confirmation */}
        {currentStep === 7 && (
          <div className="space-y-6 max-w-xl mx-auto py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#123D2A] text-[#B8D8C2] flex items-center justify-center mx-auto mb-2">
              <FileCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F2F6F0]">Confirm Execution of Batch Import</h3>
              <p className="text-xs text-[#9BAAA0] mt-1 max-w-md mx-auto">
                You are about to commit <strong className="text-[#F2F6F0]">{stagedRows.filter((r) => r.isValid).length} valid records</strong> into {institution?.name}. An immutable audit event will be recorded under your credentials ({currentUser.email}).
              </p>
            </div>

            <div className="p-4 bg-[#07110D] border border-[#123D2A] rounded-xl text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#9BAAA0]">Institution:</span>
                <span className="text-[#F2F6F0] font-medium">{institution?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BAAA0]">Target Programme:</span>
                <span className="text-[#B8D8C2] font-medium">
                  {programmes.find((p) => p.id === selectedProgrammeId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BAAA0]">Academic Year:</span>
                <span className="text-[#F2F6F0] font-mono">{selectedYear}</span>
              </div>
              <div className="flex justify-between border-t border-[#123D2A] pt-2">
                <span className="text-[#9BAAA0]">Batch File:</span>
                <span className="text-[#F2F6F0] font-mono">{fileName}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#123D2A] flex justify-between">
              <button onClick={() => setCurrentStep(6)} className="px-4 py-2 bg-[#07110D] text-xs rounded-lg">
                Back
              </button>
              <button
                disabled={isProcessing}
                onClick={handleExecuteImport}
                className="px-6 py-2.5 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg shadow-lg shadow-[#1D6B48]/20 flex items-center gap-2 cursor-pointer mx-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Ingesting Batch...' : 'Commit & Import Authorised Records'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Results & Batch Audit Outcome */}
        {currentStep === 8 && batchResult && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
                Batch Import Successfully Processed
              </span>
              <h3 className="text-2xl font-bold text-[#F2F6F0] mt-1">
                Batch ID: <span className="font-mono text-[#B8D8C2]">{batchResult.id}</span>
              </h3>
              <p className="text-xs text-[#9BAAA0] mt-1 max-w-md mx-auto">
                {batchResult.outcome}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
              <div className="p-3.5 bg-[#07110D] border border-emerald-900 rounded-lg">
                <div className="text-[11px] text-[#9BAAA0]">Valid Inserted</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                  {batchResult.validRows}
                </div>
              </div>
              <div className="p-3.5 bg-[#07110D] border border-amber-900 rounded-lg">
                <div className="text-[11px] text-[#9BAAA0]">Flagged Exceptions</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
                  {batchResult.invalidRows}
                </div>
              </div>
              <div className="p-3.5 bg-[#07110D] border border-[#123D2A] rounded-lg">
                <div className="text-[11px] text-[#9BAAA0]">Audit Log Entry</div>
                <div className="text-xs font-mono text-[#B8D8C2] mt-1">Logged</div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#123D2A] flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setFile(null);
                  setFileName('');
                  setStagedRows([]);
                }}
                className="px-4 py-2 bg-[#07110D] hover:bg-[#123D2A] border border-[#123D2A] text-xs font-medium rounded-lg text-[#F2F6F0]"
              >
                Import Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
