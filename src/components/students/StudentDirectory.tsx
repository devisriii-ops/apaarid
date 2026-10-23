import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Archive,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserX,
  QrCode
} from 'lucide-react';
import { StudentRecord, VerificationStatus, EnrolmentStatus } from '../../types';
import { appStore } from '../../services/store';
import { AddEditStudentModal } from './AddEditStudentModal';
import { StudentDetailModal } from './StudentDetailModal';
import { StudentQrCardModal } from '../qr/StudentQrCardModal';

export const StudentDirectory: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const programmes = appStore.getProgrammes(currentUser.institutionId);
  const [students, setStudents] = useState<StudentRecord[]>(appStore.getStudents());
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const [sortField, setSortField] = useState<'studentName' | 'rollNumber' | 'admissionDate'>('admissionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrStudent, setQrStudent] = useState<StudentRecord | null>(null);

  const refreshList = () => {
    setStudents(appStore.getStudents());
  };

  const handleExportCsv = () => {
    const csvData = appStore.exportStudentsCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `APAAR_Student_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filtered = students.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.studentName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.registrationNo.toLowerCase().includes(q) ||
        s.apaarMasked.includes(q);
      if (!match) return false;
    }
    if (selectedProgramme !== 'ALL' && s.programmeId !== selectedProgramme) return false;
    if (selectedStatus !== 'ALL' && s.verificationStatus !== selectedStatus) return false;
    if (selectedCategory !== 'ALL' && s.admissionCategory !== selectedCategory) return false;
    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paged
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'studentName' | 'rollNumber' | 'admissionDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">Master Enrolment Repository</span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            {currentUser.role === 'student' ? 'My Official Student Record' : 'Student Directory'}
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            {currentUser.role === 'student'
              ? 'View your registered demographic, academic, and APAAR verification attributes.'
              : 'Authorized institutional roster with privacy-preserving masked APAAR identifiers.'}
          </p>
        </div>

        {currentUser.role !== 'student' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-[#0B1812] hover:bg-[#123D2A] text-[#F2F6F0] border border-[#123D2A] hover:border-[#1D6B48] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B8D8C2]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsAddEditOpen(true);
              }}
              className="px-3.5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar (Only for non-students) */}
      {currentUser.role !== 'student' && (
        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#9BAAA0] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name, roll, APAAR..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] placeholder-[#9BAAA0]/50 focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            {/* Programme Filter */}
            <div>
              <select
                value={selectedProgramme}
                onChange={(e) => {
                  setSelectedProgramme(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="ALL">All Programmes</option>
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="ALL">All Verification Statuses</option>
                <option value="format_valid">Format Valid</option>
                <option value="officially_verified">Officially Verified</option>
                <option value="validation_issues">Validation Issues Found</option>
                <option value="awaiting_correction">Awaiting Correction</option>
                <option value="pending_validation">Pending Validation</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="ALL">All Categories</option>
                <option value="OPEN">OPEN</option>
                <option value="OBC-NCL">OBC-NCL</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="TFW">TFW</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-[#0B1812] border border-[#123D2A] rounded-xl overflow-hidden">
        {paged.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <UserX className="w-10 h-10 text-[#9BAAA0]/50 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-[#F2F6F0]">No Student Records Found</h4>
            <p className="text-xs text-[#9BAAA0] max-w-sm mx-auto mt-1">
              {searchQuery || selectedProgramme !== 'ALL'
                ? 'Try adjusting your filters or search keywords.'
                : 'No student records have been created or imported yet. Use "Add Student" or "Bulk Import Wizard" to stage records.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#123D2A] bg-[#07110D]/60 text-[#9BAAA0]">
                  <th className="py-3 px-4 font-medium">Record ID</th>
                  <th
                    className="py-3 px-4 font-medium cursor-pointer hover:text-[#F2F6F0]"
                    onClick={() => toggleSort('studentName')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Student Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">Masked APAAR ID</th>
                  <th
                    className="py-3 px-4 font-medium cursor-pointer hover:text-[#F2F6F0]"
                    onClick={() => toggleSort('rollNumber')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Roll Number</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">Programme</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Verification Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123D2A]/50">
                {paged.map((s) => (
                  <tr key={s.id} className="hover:bg-[#123D2A]/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#9BAAA0]">{s.id.slice(-8)}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#F2F6F0]">{s.studentName}</div>
                      <div className="text-[10px] text-[#9BAAA0] font-mono">{s.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#B8D8C2] bg-[#07110D] px-2 py-0.5 rounded border border-[#123D2A]">
                        {s.apaarMasked}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#F2F6F0]">{s.rollNumber}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-[180px] truncate text-[#F2F6F0] font-medium" title={s.programmeName}>
                        {s.programmeName}
                      </div>
                      <div className="text-[10px] text-[#9BAAA0] font-mono">{s.academicYear}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#C8AA6E]">{s.admissionCategory}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${
                        s.verificationStatus === 'officially_verified'
                          ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                          : s.verificationStatus === 'format_valid'
                          ? 'text-[#B8D8C2] border-[#1D6B48] bg-[#123D2A]/60'
                          : 'text-amber-400 border-amber-800 bg-amber-950/40'
                      }`}>
                        {s.verificationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setQrStudent(s);
                            setIsQrModalOpen(true);
                          }}
                          className="p-1.5 text-[#9BAAA0] hover:text-[#C8AA6E] hover:bg-[#123D2A] rounded transition-colors"
                          title="View Student QR Identity Card"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-[#9BAAA0] hover:text-[#B8D8C2] hover:bg-[#123D2A] rounded transition-colors"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {currentUser.role !== 'student' && (
                          <button
                            onClick={() => {
                              setEditingStudent(s);
                              setIsAddEditOpen(true);
                            }}
                            className="p-1.5 text-[#9BAAA0] hover:text-[#F2F6F0] hover:bg-[#123D2A] rounded transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="py-3 px-4 border-t border-[#123D2A] bg-[#07110D]/40 flex items-center justify-between text-xs text-[#9BAAA0]">
            <div>
              Showing <span className="text-[#F2F6F0] font-mono">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="text-[#F2F6F0] font-mono">{Math.min(currentPage * pageSize, sorted.length)}</span> of{' '}
              <span className="text-[#F2F6F0] font-mono">{sorted.length}</span> students
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1 rounded bg-[#07110D] border border-[#123D2A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#123D2A]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-[#F2F6F0]">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1 rounded bg-[#07110D] border border-[#123D2A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#123D2A]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <AddEditStudentModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        studentToEdit={editingStudent}
        onSaved={refreshList}
      />

      {/* Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        student={selectedStudent}
        onRefresh={refreshList}
      />

      {/* QR Identity Card Modal */}
      <StudentQrCardModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        student={qrStudent}
        onRefresh={refreshList}
        onOpenProfile={(st) => {
          setSelectedStudent(st);
          setIsDetailOpen(true);
        }}
      />
    </div>
  );
};
