import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Database,
  FileSpreadsheet,
  AlertTriangle,
  GitCompare,
  TrendingUp,
  FileText,
  Lock,
  ArrowRight,
  Download,
  Building,
  UserCheck,
  CheckCircle2,
  FileCheck2,
  Clock,
  Key,
  Users,
  Play,
  Sparkles,
  QrCode,
  Gauge
} from 'lucide-react';
import heroBannerImg from '../../assets/images/regenerated_image_1792758882446.png';
import campusStudentsHeroImg from '../../assets/images/campus_students_hero_1792761625067.jpg';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void;
  onExploreWorkspace: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreWorkspace }) => {
  return (
    <div className="min-h-screen bg-[#F4F9F4] text-[#11231A]">
      {/* Hero Section */}
      <section id="top" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 px-6 lg:px-12 overflow-hidden">
        {/* Soft background ambient gradient accents */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-[#A8D5B5]/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-12 right-10 w-[500px] h-[300px] bg-[#C5E5D0]/25 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typography & Intent */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-[#11231A] leading-[1.08]">
                Every Student.<br />
                One Trusted<br />
                <span className="relative inline-block text-[#185339] italic font-serif">
                  Academic Identity.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#C8AA6E]"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 9.5C65 3.5 185 2 297.5 7.5"
                      stroke="#C8AA6E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#4A5E52] leading-relaxed max-w-xl">
                APAAR SmartVerify AI helps institutions organise student records, validate identifiers and enrolment data, and surface inconsistencies early — giving officials a clear, trustworthy view of every academic identity.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onExploreWorkspace}
                  className="px-7 py-3.5 bg-[#185339] hover:bg-[#12422D] text-white font-semibold text-sm rounded-full transition-all shadow-[0_4px_16px_rgba(24,83,57,0.22)] flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore the platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const elem = document.getElementById('how-it-works');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-[#F9FCFA] text-[#185339] border border-[#DCE8DF] font-semibold text-sm rounded-full transition-all shadow-sm flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border border-[#185339]/30 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-[#185339] text-[#185339] ml-0.5" />
                  </div>
                  <span>How it works</span>
                </button>
              </div>

              {/* Stats Row */}
              <div className="pt-8 border-t border-[#DCE8DF] grid grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-[#5E7366] leading-tight">Records validated this cycle</div>
                  <div className="text-2xl font-bold font-serif text-[#11231A] mt-1">12,418</div>
                </div>
                <div>
                  <div className="text-xs text-[#5E7366] leading-tight">Duplicate candidates flagged</div>
                  <div className="text-2xl font-bold font-serif text-[#11231A] mt-1">327</div>
                </div>
                <div>
                  <div className="text-xs text-[#5E7366] leading-tight">Institutions onboarded</div>
                  <div className="text-2xl font-bold font-serif text-[#11231A] mt-1">86</div>
                </div>
              </div>

              <div className="text-[11px] text-[#788E80]">
                Figures shown are illustrative sample data, not live government statistics.
              </div>
            </div>

            {/* Right Column: Campus Photo with Floating Glassmorphic Cards (from apaarid.ai.studio) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_24px_60px_rgba(20,60,40,0.16)] border border-[#E3EDE5] bg-white aspect-[4/3.8] sm:aspect-[4/3.4]">
                <img
                  src={campusStudentsHeroImg}
                  alt="Students walking together on university campus in sunlight"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/campus_students_hero_1792761625067.jpg';
                  }}
                />
              </div>

              {/* Floating Card 1: Identity Verified (Top Right) */}
              <div className="absolute top-5 right-4 sm:top-6 sm:right-6 p-4 bg-white/92 backdrop-blur-md border border-white/80 rounded-2xl shadow-[0_14px_36px_rgba(15,45,30,0.14)] w-60 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#FAF3E0] border border-[#E8D4A2] flex items-center justify-center text-[#B58B2A] shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#B58B2A]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#11231A] leading-none">Identity verified</div>
                    <div className="text-[10px] font-mono text-[#5E7366] mt-0.5">APAAR ID 1 • • • • • • 4821</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-[#E6EFE8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#185339] rounded-full w-[92%]" />
                  </div>
                  <div className="text-[9px] font-mono font-semibold tracking-wider text-[#5E7366] uppercase mt-1.5">
                    Record completeness 92%
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Enrolment (Middle Left) */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-7 p-4 bg-white/92 backdrop-blur-md border border-white/80 rounded-2xl shadow-[0_16px_40px_rgba(15,45,30,0.16)] w-52 z-20">
                <div className="flex items-center justify-between text-xs text-[#5E7366]">
                  <span className="uppercase text-[10px] font-mono tracking-wider font-semibold">ENROLMENT</span>
                  <Users className="w-4 h-4 text-[#185339]" />
                </div>
                <div className="text-3xl font-bold font-serif text-[#11231A] mt-1">
                  12,418
                </div>
                <div className="flex items-end gap-1.5 h-6 mt-3">
                  <div className="w-2.5 h-2 bg-[#92BBA0] rounded-sm" />
                  <div className="w-2.5 h-3 bg-[#92BBA0] rounded-sm" />
                  <div className="w-2.5 h-4.5 bg-[#185339] rounded-sm" />
                  <div className="w-2.5 h-3.5 bg-[#92BBA0] rounded-sm" />
                  <div className="w-2.5 h-5 bg-[#185339] rounded-sm" />
                  <div className="w-2.5 h-6 bg-[#185339] rounded-sm" />
                  <div className="w-2.5 h-5.5 bg-[#185339] rounded-sm" />
                </div>
              </div>

              {/* Floating Card 3: Validation This Week (Bottom Right) */}
              <div className="absolute -bottom-4 right-4 sm:right-6 p-4 bg-white/92 backdrop-blur-md border border-white/80 rounded-2xl shadow-[0_16px_40px_rgba(15,45,30,0.16)] w-60 z-20">
                <div className="flex items-center justify-between text-xs text-[#5E7366]">
                  <span className="uppercase text-[10px] font-mono tracking-wider font-semibold">VALIDATION THIS WEEK</span>
                  <TrendingUp className="w-4 h-4 text-[#185339]" />
                </div>
                <div className="h-10 mt-2 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 160 40" fill="none">
                    <defs>
                      <linearGradient id="valGradHero" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#185339" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#185339" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 32 C 30 32, 50 24, 80 20 C 110 16, 130 10, 160 8 L 160 40 L 0 40 Z"
                      fill="url(#valGradHero)"
                    />
                    <path
                      d="M0 32 C 30 32, 50 24, 80 20 C 110 16, 130 10, 160 8"
                      stroke="#185339"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="text-[10px] text-[#5E7366] font-mono mt-1">
                  <strong className="text-[#11231A] font-semibold">1,712 approved</strong> · illustrative
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="solution" className="py-20 px-6 lg:px-12 border-t border-[#E3EDE5] bg-[#EEF6F0]/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#185339] font-bold">
              Institutional Challenges & Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#11231A] mt-2">
              Overcoming Systemic Data Fragmentation in Technical Education
            </h2>
            <p className="text-sm sm:text-base text-[#4A5E52] mt-3 leading-relaxed">
              Managing student lifecycle records across heterogeneous departments often introduces formatting errors, intake discrepancies, and untracked changes. APAAR SmartVerify AI introduces standardised controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#185339]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EC] flex items-center justify-center text-[#185339] mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#11231A]">Fragmented Institutional Submissions</h3>
              <p className="text-xs text-[#4A5E52] mt-2 leading-relaxed">
                Centralizes siloed admissions, lateral entry, and quota batches into an institutional single source of truth validated against academic year calendars.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#185339]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EC] flex items-center justify-center text-[#185339] mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#11231A]">Incomplete or Inconsistent Data</h3>
              <p className="text-xs text-[#4A5E52] mt-2 leading-relaxed">
                Deterministic validation flags missing mandatory fields, irregular date ranges, and invalid category assignments prior to formal record persistence.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#185339]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EC] flex items-center justify-center text-[#185339] mb-4">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#11231A]">Duplicate Record Detection</h3>
              <p className="text-xs text-[#4A5E52] mt-2 leading-relaxed">
                Keyed HMAC deterministic hashes detect cross-batch duplicate APAAR submissions without exposing cleartext national identifiers in search indexes.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#185339]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EC] flex items-center justify-center text-[#185339] mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#11231A]">Approved Intake Monitoring</h3>
              <p className="text-xs text-[#4A5E52] mt-2 leading-relaxed">
                Compares actual enrolled headcounts directly against official AICTE Extension of Approval (EoA) seat capacity to prevent accidental over-enrolment.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#185339]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EC] flex items-center justify-center text-[#185339] mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#11231A]">Traceability & Audit History</h3>
              <p className="text-xs text-[#4A5E52] mt-2 leading-relaxed">
                Every modification, validation decision, duplicate resolution, and report export is permanently recorded with user identity and timestamp.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm hover:shadow-md hover:border-[#185339]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EC] flex items-center justify-center text-[#185339] mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#11231A]">Controlled Institutional Reporting</h3>
              <p className="text-xs text-[#4A5E52] mt-2 leading-relaxed">
                Generates audit-ready PDF summaries and formula-sanitized CSV exports with strict permission gating and automatic identifier masking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Functional Suite / Intelligent Validation Section */}
      <section id="platform" className="relative py-20 lg:py-28 px-6 lg:px-12 bg-[#07140E] text-[#F2F6F0] overflow-hidden border-t border-[#132D20]">
        {/* Subtle mesh background and glowing ambient effects */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#174830]/35 via-[#0A2217]/20 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#113824]/30 via-transparent to-transparent blur-[140px] pointer-events-none" />

        {/* Constellation web SVG pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2EE59D" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2EE59D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g stroke="#1F4D36" strokeWidth="1" strokeDasharray="3 3">
            <line x1="8%" y1="20%" x2="25%" y2="40%" />
            <line x1="25%" y1="40%" x2="45%" y2="25%" />
            <line x1="45%" y1="25%" x2="60%" y2="60%" />
            <line x1="60%" y1="60%" x2="75%" y2="35%" />
            <line x1="75%" y1="35%" x2="92%" y2="50%" />
            <line x1="25%" y1="40%" x2="35%" y2="75%" />
            <line x1="35%" y1="75%" x2="60%" y2="60%" />
            <line x1="60%" y1="60%" x2="85%" y2="80%" />
            <line x1="75%" y1="35%" x2="85%" y2="15%" />
          </g>
          <g fill="#34D399">
            <circle cx="8%" cy="20%" r="3" opacity="0.6" />
            <circle cx="25%" cy="40%" r="4" opacity="0.8" />
            <circle cx="45%" cy="25%" r="3.5" opacity="0.7" />
            <circle cx="60%" cy="60%" r="4.5" opacity="0.9" />
            <circle cx="75%" cy="35%" r="4" opacity="0.8" />
            <circle cx="92%" cy="50%" r="3" opacity="0.5" />
            <circle cx="35%" cy="75%" r="3.5" opacity="0.7" />
            <circle cx="85%" cy="80%" r="4" opacity="0.75" />
            <circle cx="85%" cy="15%" r="3" opacity="0.6" />
          </g>
        </svg>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Showcase: Intelligent Validation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Subtitle & 4 Micro Cards */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#133124] border border-[#214D38] text-[11px] font-mono font-medium text-[#A8D5B5] tracking-wider uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                <span>INTELLIGENT VALIDATION</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#F2F6F0] tracking-tight leading-[1.12]">
                The platform reads the fine print, before anyone has to
              </h2>

              <p className="text-base sm:text-lg text-[#9CB3A6] leading-relaxed mt-5 max-w-xl">
                Validation runs continuously across incoming records — flagging duplicate candidates, inconsistent fields and intake anomalies as review-ready cases, not silent errors.
              </p>

              {/* 4 Feature Micro Cards (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-9">
                <div className="p-5 bg-[#0C1E16]/85 hover:bg-[#10271D] border border-[#1C3D2E] rounded-2xl transition-all">
                  <h4 className="text-sm sm:text-base font-bold text-[#EBF4EE]">Duplicate detection</h4>
                  <p className="text-xs sm:text-sm text-[#8BA796] mt-1.5 leading-relaxed">
                    Similar candidates surface with match confidence for review.
                  </p>
                </div>

                <div className="p-5 bg-[#0C1E16]/85 hover:bg-[#10271D] border border-[#1C3D2E] rounded-2xl transition-all">
                  <h4 className="text-sm sm:text-base font-bold text-[#EBF4EE]">Inconsistency flags</h4>
                  <p className="text-xs sm:text-sm text-[#8BA796] mt-1.5 leading-relaxed">
                    Mismatched fields and impossible combinations are highlighted.
                  </p>
                </div>

                <div className="p-5 bg-[#0C1E16]/85 hover:bg-[#10271D] border border-[#1C3D2E] rounded-2xl transition-all">
                  <h4 className="text-sm sm:text-base font-bold text-[#EBF4EE]">Intake indicators</h4>
                  <p className="text-xs sm:text-sm text-[#8BA796] mt-1.5 leading-relaxed">
                    Enrolment pressure and utilisation visible per programme.
                  </p>
                </div>

                <div className="p-5 bg-[#0C1E16]/85 hover:bg-[#10271D] border border-[#1C3D2E] rounded-2xl transition-all">
                  <h4 className="text-sm sm:text-base font-bold text-[#EBF4EE]">Review-first design</h4>
                  <p className="text-xs sm:text-sm text-[#8BA796] mt-1.5 leading-relaxed">
                    Nothing is auto-rejected — staff decide with full context.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 2 Interactive Glass Preview Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Preview Card 1: Duplicate Candidate Detected */}
              <div className="p-6 bg-[#0D2118]/90 border border-[#1E4332] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#2A1E14] border border-[#523A1E] flex items-center justify-center text-[#F59E0B] shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F2F6F0]">Duplicate candidate detected</h3>
                    <p className="text-xs text-[#7F9C8C] mt-0.5">2 similar records · intake 2026</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 bg-[#122B20]/90 border border-[#1E4332] rounded-xl flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#E2EFE7]">K. Sharma · B.Tech CS</span>
                    <span className="text-xs font-mono font-bold text-[#F6C667] bg-[#2E2812] border border-[#5C4A1C] px-2.5 py-1 rounded-full">
                      98% match
                    </span>
                  </div>
                  <div className="p-3.5 bg-[#122B20]/90 border border-[#1E4332] rounded-xl flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#E2EFE7]">K. Sharma · B.Sc DS</span>
                    <span className="text-xs font-mono font-bold text-[#F6C667] bg-[#2E2812] border border-[#5C4A1C] px-2.5 py-1 rounded-full">
                      94% match
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#183628] flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-[#5A7B6A] uppercase">
                    SAMPLE ALERT · ILLUSTRATIVE DATA
                  </span>
                </div>
              </div>

              {/* Preview Card 2: Intake Utilisation */}
              <div className="p-6 bg-[#0D2118]/90 border border-[#1E4332] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#142B20] border border-[#214D38] flex items-center justify-center text-[#4ADE80] shrink-0">
                    <Gauge className="w-5 h-5 text-[#4ADE80]" />
                  </div>
                  <h3 className="text-base font-bold text-[#F2F6F0]">Intake utilisation</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#E2EFE7]">B.Tech CS</span>
                      <span className="font-mono text-[#8BA796]">92%</span>
                    </div>
                    <div className="h-2 bg-[#173829] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#34D399] to-[#EAB308] rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#E2EFE7]">B.Sc Data Sci</span>
                      <span className="font-mono text-[#8BA796]">78%</span>
                    </div>
                    <div className="h-2 bg-[#173829] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#34D399] to-[#EAB308] rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#E2EFE7]">MBA Finance</span>
                      <span className="font-mono text-[#8BA796]">64%</span>
                    </div>
                    <div className="h-2 bg-[#173829] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#34D399] to-[#EAB308] rounded-full w-[64%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#183628] flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-[#5A7B6A] uppercase">
                    ILLUSTRATIVE SAMPLE DATA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Suite: 12 Enterprise Functional Modules */}
          <div className="mt-20 pt-16 border-t border-[#173827]">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#4ADE80] font-bold">
                Complete Functional Suite
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#F2F6F0] mt-2">
                12 Enterprise Verification & Management Modules
              </h3>
              <p className="text-sm text-[#8BA796] mt-2 leading-relaxed">
                Every tool is fully wired to persistent storage with role-authorized access controls, audit trail logging, and live institution synchronization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: '1. Institution Directory',
                  desc: 'Hierarchical navigation (India → State → District → College) with verifiable AICTE Permanent IDs and EoA statuses.',
                  icon: Building
                },
                {
                  title: '2. Student Directory',
                  desc: 'Searchable student master records featuring masked APAAR IDs, quota filters, and document verification histories.',
                  icon: UserCheck
                },
                {
                  title: '3. QR Identity Cards',
                  desc: 'Tamper-evident photographic student QR badges with instant mobile phone camera profile verification.',
                  icon: QrCode
                },
                {
                  title: '4. CSV/XLSX Bulk Import',
                  desc: '8-step wizard with file inspection, custom column mapping, preview staging, and inline error correction.',
                  icon: FileSpreadsheet
                },
                {
                  title: '5. Deterministic Validation',
                  desc: 'Automated rules engine catching invalid formatting, date inconsistencies, and missing category metadata.',
                  icon: AlertTriangle
                },
                {
                  title: '6. Duplicate Detection',
                  desc: 'HMAC collision inspection comparing candidates side-by-side with reviewer decision logging.',
                  icon: GitCompare
                },
                {
                  title: '7. Approved Intake Monitoring',
                  desc: 'Visual seat utilization analytics comparing live enrolments against official AICTE approved intakes.',
                  icon: TrendingUp
                },
                {
                  title: '8. Verification Review',
                  desc: 'Multi-stage verification tracker distinguishing preliminary format validation from official gateway status.',
                  icon: ShieldCheck
                },
                {
                  title: '9. Institution Reports',
                  desc: '10 custom reporting templates covering enrolment breakdowns, compliance logs, and data completeness.',
                  icon: FileText
                },
                {
                  title: '10. Immutable Audit Trail',
                  desc: 'Comprehensive activity logs capturing every record modification, review decision, and batch upload.',
                  icon: Clock
                },
                {
                  title: '11. Role-Based Access Control',
                  desc: 'Strict isolation across Student, Staff, Institution Administrator, and Platform Oversight roles.',
                  icon: Lock
                },
                {
                  title: '12. PDF & CSV Export Centre',
                  desc: 'Print-ready compliance PDFs and sanitized CSV downloads with sensitive identifier redaction.',
                  icon: Download
                }
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    onClick={onExploreWorkspace}
                    className="p-5 bg-[#0C1E16]/80 hover:bg-[#10271D] border border-[#1C3D2E] hover:border-[#34D399]/40 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#143224] group-hover:bg-[#1A4230] flex items-center justify-center text-[#4ADE80] mb-3 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#EBF4EE] mb-1.5 flex items-center justify-between">
                      <span>{f.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#5A7B6A] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </h4>
                    <p className="text-xs text-[#8BA796] leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 border-t border-[#E3EDE5] bg-[#EEF6F0]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-[#185339] font-bold">
              Workflow Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#11231A] mt-2">
              The 8-Stage Institutional Verification Pipeline
            </h2>
            <p className="text-sm text-[#4A5E52] mt-2">
              From secure sign-in to verified institutional reporting with zero manual guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Authenticate Securely', desc: 'Sign in with institutional credentials or Google SSO. Role authorization bounds data scope.' },
              { step: '02', title: 'Select Institution', desc: 'Connect to verified AICTE reference profile with confirmed Extension of Approval details.' },
              { step: '03', title: 'Import / Enter Data', desc: 'Add individual students or execute bulk CSV import with visual column mapping.' },
              { step: '04', title: 'Automated Validation', desc: 'Deterministic rules inspect 12-digit APAAR format, eligibility, and academic year alignment.' },
              { step: '05', title: 'Resolve Flagged Issues', desc: 'Inspect validation findings, request student corrections, or rectify stage errors.' },
              { step: '06', title: 'Review Verification', desc: 'Examine verification findings and resolve potential duplicate candidates with logged decisions.' },
              { step: '07', title: 'Monitor Approved Intake', desc: 'Cross-reference active enrollments against official AICTE approved capacities in real time.' },
              { step: '08', title: 'Export & Audit', desc: 'Generate printable PDF audit packages and formula-safe CSV exports with logged history.' }
            ].map((s, idx) => (
              <div key={idx} className="p-5 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm relative hover:shadow-md transition-shadow">
                <div className="text-2xl font-mono font-bold text-[#185339] mb-2">{s.step}</div>
                <h4 className="text-sm font-bold text-[#11231A] mb-1">{s.title}</h4>
                <p className="text-xs text-[#4A5E52] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & Trust/Security Section */}
      <section id="trust-security" className="py-20 px-6 lg:px-12 border-t border-[#E3EDE5]">
        <div id="analytics" className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#185339] font-bold">
                Compliance & Privacy Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-[#11231A]">
                Built with Zero-Compromise Data Governance
              </h2>
              <p className="text-sm sm:text-base text-[#4A5E52] leading-relaxed">
                National educational identity records require strict safeguards. APAAR SmartVerify AI separates format validation from official government API verification, enforces tenant-isolated boundaries, and never stores cleartext national identifiers.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 p-4 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3EC] flex items-center justify-center text-[#185339] shrink-0 mt-0.5">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#11231A]">Deterministic Keyed HMAC Identifier Protection</h5>
                    <p className="text-xs text-[#4A5E52] mt-0.5 leading-relaxed">
                      Duplicate checks are conducted through cryptographically salted HMAC hashes; tables and audit logs mask numbers as <code className="font-mono text-[#185339] font-semibold">••••-••••-XXXX</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3EC] flex items-center justify-center text-[#185339] shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#11231A]">No Fabricated Verification Badges</h5>
                    <p className="text-xs text-[#4A5E52] mt-0.5 leading-relaxed">
                      Format validity is never presented as official DigiLocker verification unless an active API gateway token is explicitly configured and verified.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-white border border-[#E3EDE5] rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3EC] flex items-center justify-center text-[#185339] shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#11231A]">Multi-Tenant Access Boundaries</h5>
                    <p className="text-xs text-[#4A5E52] mt-0.5 leading-relaxed">
                      Staff cannot inspect records from rival colleges; students can only view their own registered profile and personal reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white border border-[#E3EDE5] p-6 sm:p-8 rounded-3xl shadow-sm">
              <h4 className="text-sm font-bold text-[#11231A] mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#185339]" />
                <span>Verification State Integrity Matrix</span>
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 bg-[#F6FAF6] rounded-xl border border-[#E3EDE5] flex items-center justify-between">
                  <span className="text-[#4A5E52]">12-Digit Format Valid</span>
                  <span className="text-[#185339] font-bold">Checksum Validated</span>
                </div>
                <div className="p-3.5 bg-[#F6FAF6] rounded-xl border border-[#E3EDE5] flex items-center justify-between">
                  <span className="text-[#4A5E52]">External APAAR Gateway</span>
                  <span className="text-[#B58B2A] font-bold">Sandbox Connector Ready</span>
                </div>
                <div className="p-3.5 bg-[#F6FAF6] rounded-xl border border-[#E3EDE5] flex items-center justify-between">
                  <span className="text-[#4A5E52]">Intake Capacity Check</span>
                  <span className="text-[#185339] font-bold">AICTE EoA Compliant</span>
                </div>
                <div className="p-3.5 bg-[#F6FAF6] rounded-xl border border-[#E3EDE5] flex items-center justify-between">
                  <span className="text-[#4A5E52]">CSV Formula Defense</span>
                  <span className="text-[#185339] font-bold">OWASP Compliant</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E3EDE5] flex items-center justify-between">
                <span className="text-xs text-[#5E7366]">Ready to test verified data?</span>
                <button
                  onClick={() => onOpenAuth('institution_admin')}
                  className="px-5 py-2.5 bg-[#185339] hover:bg-[#12422D] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  Enter Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-white border-t border-[#E3EDE5] text-xs text-[#5E7366]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#185339] flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#11231A]">APAAR SmartVerify AI</span>
            <span>·</span>
            <span>Technical Education Verification Architecture</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onOpenAuth()} className="hover:text-[#185339] transition-colors cursor-pointer">
              Institutional Sign In
            </button>
            <a href="https://apaar.education.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#185339] transition-colors">
              Official APAAR Reference
            </a>
            <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="hover:text-[#185339] transition-colors">
              AICTE Portal
            </a>
          </div>

          <div className="text-[11px] text-[#788E80] font-mono">
            Platform Dataset v2025.2 · Local Government Directory (LGD) Synchronized
          </div>
        </div>
      </footer>
    </div>
  );
};
