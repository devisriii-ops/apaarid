import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Key,
  Server,
  Lock,
  Search,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { validateApaarFormat, validateVerhoeffChecksum, computeApaarHmac } from '../../utils/apaarCrypto';
import { appStore } from '../../services/store';

export const VerificationCenter: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const students = appStore.getStudents();

  // Interactive Live Tester State
  const [testInput, setTestInput] = useState('847291038472');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    formatValid: boolean;
    verhoeffValid: boolean;
    masked: string;
    hmacHash: string;
    errors: string[];
  } | null>(null);

  // Gateway status configuration toggle
  const [gatewayConfigured, setGatewayConfigured] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const format = validateApaarFormat(testInput);
    const verhoeff = format.isValid ? validateVerhoeffChecksum(format.normalized) : false;
    const hmac = await computeApaarHmac(testInput);

    setTestResult({
      tested: true,
      formatValid: format.isValid,
      verhoeffValid: verhoeff,
      masked: format.masked,
      hmacHash: hmac,
      errors: format.errors
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Educational Identity Verification Protocol
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            APAAR Verification & Gateway Centre
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Rigorous separation between structural format validation and official external identity verification.
          </p>
        </div>
      </div>

      {/* Mandatory Regulatory Grounding Banner */}
      <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-[#C8AA6E] shrink-0 mt-0.5" />
        <div className="text-[#9BAAA0] leading-relaxed">
          <strong className="text-[#F2F6F0]">Section 17 Protocol Requirement:</strong> A valid 12-digit identifier format (conforming to Verhoeff checksums) constitutes format validity only. It must never be presented as official identity verification unless signed by an authorised DigiLocker / ABC API Setu government gateway with valid partner credentials.
        </div>
      </div>

      {/* Verification Status Breakdown across records */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Format Validated (Preliminary)</div>
          <div className="text-2xl font-bold font-mono text-[#B8D8C2] mt-1 tabular-nums">
            {students.filter((s) => s.verificationStatus === 'format_valid').length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">12-digit structure & checksum passed</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Officially Verified (Gateway)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {students.filter((s) => s.verificationStatus === 'officially_verified').length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">DigiLocker / ABC Sandbox Authenticated</div>
        </div>

        <div className="p-4 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="text-xs text-[#9BAAA0]">Awaiting Authorised Correction</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {students.filter((s) => s.verificationStatus === 'validation_issues' || s.verificationStatus === 'awaiting_correction').length}
          </div>
          <div className="text-[11px] text-[#9BAAA0] mt-1">Pending student or document update</div>
        </div>
      </div>

      {/* Two Column: Live Interactive Format Tester & Gateway Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Verifier Tool */}
        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-[#B8D8C2]" />
            <h3 className="text-sm font-semibold text-[#F2F6F0]">Interactive APAAR Format & Checksum Verifier</h3>
          </div>
          <p className="text-xs text-[#9BAAA0] mb-4">
            Test any 12-digit APAAR / ABC candidate identifier through the platform's deterministic parser and Verhoeff checksum algorithm.
          </p>

          <form onSubmit={handleRunTest} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Enter 12-Digit APAAR Candidate
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={14}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="e.g. 847291038472"
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
          </form>

          {/* Test Outcome Output */}
          {testResult && (
            <div className="mt-4 p-4 bg-[#07110D] border border-[#123D2A] rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#123D2A]">
                <span className="text-[#9BAAA0]">Structural Format Check:</span>
                {testResult.formatValid ? (
                  <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 12 Numerical Digits Valid
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold font-mono flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Format Failed
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9BAAA0]">Privacy Masked Output:</span>
                <span className="font-mono text-[#F2F6F0] font-semibold">{testResult.masked}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9BAAA0]">Deterministic HMAC Signature:</span>
                <span className="font-mono text-[10px] text-[#B8D8C2] max-w-[200px] truncate" title={testResult.hmacHash}>
                  {testResult.hmacHash}
                </span>
              </div>

              {testResult.errors.length > 0 && (
                <div className="pt-2 text-red-400 text-[11px] font-mono">
                  {testResult.errors.join('; ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Official APAAR Gateway Connector Status */}
        <div className="p-5 bg-[#0B1812] border border-[#123D2A] rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#C8AA6E]" />
              <h3 className="text-sm font-semibold text-[#F2F6F0]">Official APAAR / API Setu Gateway Status</h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
              gatewayConfigured
                ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                : 'text-amber-400 border-amber-800 bg-amber-950/40'
            }`}>
              {gatewayConfigured ? 'Connected (Sandbox)' : 'Not Configured'}
            </span>
          </div>

          <p className="text-xs text-[#9BAAA0] mb-4">
            Integration endpoint for DigiLocker / Academic Bank of Credits (ABC) directory verification.
          </p>

          {!gatewayConfigured ? (
            <div className="p-4 bg-[#07110D] border border-amber-900/50 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Official APAAR verification is not configured</span>
              </div>
              <p className="text-[#9BAAA0] leading-relaxed text-[11px]">
                To authenticate records against the live National Academic Depository, configure an approved institutional API Client ID from{' '}
                <a
                  href="https://directory.apisetu.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#B8D8C2] underline"
                >
                  directory.apisetu.gov.in
                </a>.
              </p>

              <button
                onClick={() => setGatewayConfigured(true)}
                className="px-3.5 py-1.5 bg-[#123D2A] hover:bg-[#1D6B48] text-[#F2F6F0] text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                Enable Sandbox Gateway Simulator
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sandbox API Setu Connector Active</span>
              </div>
              <p className="text-[#9BAAA0] text-[11px]">
                Endpoint: <code className="text-[#B8D8C2]">https://directory.apisetu.gov.in/api/v1/abc/verify</code>
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setGatewayConfigured(false)}
                  className="text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Disconnect Gateway
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
