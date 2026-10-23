import React, { useState } from 'react';
import {
  History,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { ImportBatch } from '../../types';
import { appStore } from '../../services/store';

interface ImportHistoryProps {
  onNavigateImport: () => void;
}

export const ImportHistory: React.FC<ImportHistoryProps> = ({ onNavigateImport }) => {
  const [batches, setBatches] = useState<ImportBatch[]>(appStore.getImportBatches());
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);

  const downloadErrorLog = (batch: ImportBatch) => {
    if (!batch.errorLog || batch.errorLog.length === 0) return;
    const header = ['Row Number', 'Field Name', 'Validation Issue', 'Raw Input Value'].join(',');
    const rows = batch.errorLog.map((e) => [e.row, e.field, `"${e.error.replace(/"/g, '""')}"`, `"${e.rawValue}"`].join(','));
    const content = [header, ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Import_Errors_${batch.id}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">Ingestion Audit Log</span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Batch Import History
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Immutable log of all institutional CSV/XLSX submissions with row-level error accountability.
          </p>
        </div>

        <button
          onClick={onNavigateImport}
          className="px-3.5 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>New Batch Import</span>
        </button>
      </div>

      {/* Batches Table Card */}
      <div className="bg-[#0B1812] border border-[#123D2A] rounded-xl overflow-hidden">
        {batches.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <History className="w-10 h-10 text-[#9BAAA0]/40 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-[#F2F6F0]">No Import Batches Executed</h4>
            <p className="text-xs text-[#9BAAA0] max-w-sm mx-auto mt-1">
              No files have been ingested for this institution yet. Use the bulk import wizard to stage and commit student spreadsheets.
            </p>
            <button
              onClick={onNavigateImport}
              className="mt-4 px-4 py-2 bg-[#123D2A] hover:bg-[#1D6B48] text-xs text-[#F2F6F0] font-medium rounded-lg cursor-pointer"
            >
              Upload First Batch
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#123D2A] bg-[#07110D]/60 text-[#9BAAA0]">
                  <th className="py-3 px-4 font-medium">Batch ID</th>
                  <th className="py-3 px-4 font-medium">Source Filename</th>
                  <th className="py-3 px-4 font-medium">Academic Year</th>
                  <th className="py-3 px-4 font-medium">Uploaded By</th>
                  <th className="py-3 px-4 font-medium">Timestamp</th>
                  <th className="py-3 px-4 font-medium">Processed</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123D2A]/50">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#123D2A]/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#B8D8C2]">{b.id}</td>
                    <td className="py-3 px-4 font-medium text-[#F2F6F0] flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-[#9BAAA0]" />
                      <span>{b.filename}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#9BAAA0]">{b.academicYear}</td>
                    <td className="py-3 px-4 text-[#F2F6F0]">{b.uploadedBy}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#9BAAA0]">
                      {new Date(b.uploadedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-400">{b.validRows} valid</span>
                      {b.invalidRows > 0 && <span className="text-amber-400 ml-1">/ {b.invalidRows} err</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${
                        b.status === 'Completed'
                          ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                          : 'text-amber-400 border-amber-800 bg-amber-950/40'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.invalidRows > 0 && (
                          <button
                            onClick={() => downloadErrorLog(b)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-[#123D2A] rounded transition-colors"
                            title="Download Error Report CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedBatch(b)}
                          className="px-2.5 py-1 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-[11px] rounded transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 text-[#F2F6F0]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#123D2A]">
              <div>
                <span className="text-[10px] font-mono text-[#C8AA6E] uppercase">Batch Ingestion Audit Record</span>
                <h3 className="text-lg font-bold text-[#F2F6F0] mt-0.5">{selectedBatch.id}</h3>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-[#9BAAA0] hover:text-[#F2F6F0] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg">
                <div className="text-[#9BAAA0]">Outcome Description:</div>
                <div className="text-[#F2F6F0] font-medium mt-1 leading-relaxed">{selectedBatch.outcome}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg">
                  <span className="text-[#9BAAA0]">Uploaded By:</span>
                  <div className="text-[#F2F6F0] font-medium mt-0.5">{selectedBatch.uploadedBy}</div>
                </div>
                <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg">
                  <span className="text-[#9BAAA0]">Academic Year:</span>
                  <div className="font-mono text-[#F2F6F0] mt-0.5">{selectedBatch.academicYear}</div>
                </div>
              </div>

              {selectedBatch.errorLog && selectedBatch.errorLog.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-amber-300 mb-2">Error Summary Breakdown:</div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 border border-[#123D2A] p-2.5 rounded-lg bg-[#07110D]">
                    {selectedBatch.errorLog.map((err, i) => (
                      <div key={i} className="text-[11px] text-[#9BAAA0] border-b border-[#123D2A]/50 pb-1">
                        <strong className="text-[#F2F6F0]">Row {err.row}:</strong> {err.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#123D2A] flex justify-end">
              <button
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-1.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
