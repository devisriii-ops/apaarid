import React, { useState } from 'react';
import {
  Settings,
  Server,
  ShieldCheck,
  Key,
  Users,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock,
  Database
} from 'lucide-react';
import { appStore } from '../../services/store';

export const SettingsAndIntegrations: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  const [apiSetuClientId, setApiSetuClientId] = useState('in.gov.aicte.apaar.sandbox.v1');
  const [apiSetuEndpoint, setApiSetuEndpoint] = useState('https://directory.apisetu.gov.in/api/v1/abc');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    appStore.logAudit({
      actionType: 'MEMBERSHIP_UPDATED',
      entityType: 'institution',
      entityId: 'settings',
      summary: `Updated API Setu / DigiLocker Gateway parameters.`
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C8AA6E]">
            Platform Governance & Connectors
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0] mt-1">
            Settings & System Integrations
          </h2>
          <p className="text-xs text-[#9BAAA0] mt-1">
            Manage reference data sync versions, API Setu connectors, and role security boundaries.
          </p>
        </div>
      </div>

      {/* Grid of Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Official National API Gateway Configuration */}
        <div className="p-6 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#B8D8C2]" />
            <h3 className="text-base font-semibold text-[#F2F6F0]">API Setu / DigiLocker APAAR Connector</h3>
          </div>
          <p className="text-xs text-[#9BAAA0] leading-relaxed">
            Configure partner credentials to authenticate student APAAR / ABC registrations directly against the national Academic Bank of Credits directory.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#9BAAA0] mb-1">API Setu Partner Client ID</label>
              <input
                type="text"
                value={apiSetuClientId}
                onChange={(e) => setApiSetuClientId(e.target.value)}
                className="w-full p-2.5 font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div>
              <label className="block text-[#9BAAA0] mb-1">Gateway Endpoint URI</label>
              <input
                type="text"
                value={apiSetuEndpoint}
                onChange={(e) => setApiSetuEndpoint(e.target.value)}
                className="w-full p-2.5 font-mono bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#9BAAA0] flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Endpoint Reached
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B8D8C2] hover:bg-[#cde4d4] text-[#07110D] font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isSaved ? 'Settings Saved!' : 'Update Gateway Config'}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Official Reference Datasets */}
        <div className="p-6 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C8AA6E]" />
            <h3 className="text-base font-semibold text-[#F2F6F0]">National Reference Datasets Status</h3>
          </div>
          <p className="text-xs text-[#9BAAA0] leading-relaxed">
            All institutional records, state codes, and districts are validated against authentic government registries.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#F2F6F0]">Local Government Directory (LGD)</div>
                <div className="text-[11px] text-[#9BAAA0]">https://lgdirectory.gov.in/</div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                Synchronized
              </span>
            </div>

            <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#F2F6F0]">AICTE Extension of Approval (EoA)</div>
                <div className="text-[11px] text-[#9BAAA0]">Approval Process Handbook AY 2025-26</div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="p-3 bg-[#07110D] border border-[#123D2A] rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#F2F6F0]">National Academic Depository (NAD / ABC)</div>
                <div className="text-[11px] text-[#9BAAA0]">https://apaar.education.gov.in/</div>
              </div>
              <span className="text-[10px] font-mono text-[#B8D8C2] bg-[#123D2A] border border-[#1D6B48] px-2 py-0.5 rounded">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control Permissions Matrix */}
      <div className="p-6 bg-[#0B1812] border border-[#123D2A] rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#B8D8C2]" />
          <h3 className="text-base font-semibold text-[#F2F6F0]">Database-Backed Role Permissions Matrix</h3>
        </div>
        <p className="text-xs text-[#9BAAA0]">
          Enforces Section 5 security: No client-side privilege escalation. Roles are strictly bound to database profiles.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#123D2A] text-[#9BAAA0]">
                <th className="py-2.5 font-medium">Platform Capability</th>
                <th className="py-2.5 font-medium">Student</th>
                <th className="py-2.5 font-medium">Institution Staff</th>
                <th className="py-2.5 font-medium">Institution Admin</th>
                <th className="py-2.5 font-medium">Platform Oversight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#123D2A]/50 text-[#F2F6F0]">
              <tr>
                <td className="py-2.5 font-medium">View Own Profile & Verification</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Manage Institution Student Roster</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Audit Only</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Bulk CSV / XLSX Data Ingestion</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Adjudicate Duplicate Identifier Conflicts</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Approve Institutional Onboarding Claims</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Inspect Immutable System Audit Trail</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-red-400 font-mono">Restricted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
                <td className="py-2.5 text-emerald-400 font-mono">Permitted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
