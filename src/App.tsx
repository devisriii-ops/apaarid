import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from './types';
import { appStore } from './services/store';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { AppShell, ActiveTab } from './components/layout/AppShell';

// Workspace Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { StudentDirectory } from './components/students/StudentDirectory';
import { StudentQrIdentitySection } from './components/qr/StudentQrIdentitySection';
import { InstantProfileVerificationView } from './components/qr/InstantProfileVerificationView';
import { AcademicEnrolment } from './components/enrolment/AcademicEnrolment';
import { BulkImportWizard } from './components/imports/BulkImportWizard';
import { ImportHistory } from './components/imports/ImportHistory';
import { ValidationFindings } from './components/validation/ValidationFindings';
import { DuplicateReview } from './components/duplicates/DuplicateReview';
import { ProgrammeManagement } from './components/programmes/ProgrammeManagement';
import { ApprovedIntakeMonitoring } from './components/intake/ApprovedIntakeMonitoring';
import { VerificationCenter } from './components/verification/VerificationCenter';
import { InstitutionReports } from './components/reports/InstitutionReports';
import { ExportCenter } from './components/reports/ExportCenter';
import { AuditTrail } from './components/audit/AuditTrail';
import { InstitutionDirectory } from './components/institutions/InstitutionDirectory';
import { SettingsAndIntegrations } from './components/settings/SettingsAndIntegrations';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(appStore.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<ActiveTab>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('institution_admin');
  const [scannedQrToken, setScannedQrToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setCurrentUser(appStore.getCurrentUser());
    });

    // Check if browser opened via QR scan link (e.g. ?verify_qr=apaar_qr_...)
    const checkUrlForQr = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const qr = params.get('verify_qr') || params.get('qr_token');
        if (qr) {
          setScannedQrToken(qr);
        }
      } catch (err) {
        console.error('URL parse error:', err);
      }
    };
    checkUrlForQr();
    window.addEventListener('popstate', checkUrlForQr);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', checkUrlForQr);
    };
  }, []);

  const handleOpenAuth = (role: string = 'institution_admin') => {
    setAuthDefaultRole(role as UserRole);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (role: UserRole) => {
    setIsAuthenticated(true);
    setCurrentTab('overview');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearScannedQr = () => {
    setScannedQrToken(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('verify_qr');
      url.searchParams.delete('qr_token');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    } catch {}
  };

  // If page was loaded via mobile phone camera QR scan, render the Instant Verification view immediately!
  if (scannedQrToken) {
    return (
      <div className="min-h-screen bg-[#07110D] text-[#F2F6F0]">
        <InstantProfileVerificationView
          token={scannedQrToken}
          onReturnToPlatform={handleClearScannedQr}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultRole="student"
          onSuccess={(role) => {
            // Re-render to reflect unlocked Level B profile
            setCurrentUser(appStore.getCurrentUser());
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${!isAuthenticated ? 'bg-[#F4F9F4] text-[#11231A]' : 'bg-[#07110D] text-[#F2F6F0]'}`}>
      {!isAuthenticated ? (
        <>
          <Navbar
            onOpenAuth={handleOpenAuth}
            onNavigateSection={handleNavigateSection}
          />
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onExploreWorkspace={() => {
              setIsAuthenticated(true);
              setCurrentTab('overview');
            }}
          />
        </>
      ) : (
        <AppShell
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onSignOut={handleSignOut}
          onOpenRoleSwitcher={() => setIsAuthModalOpen(true)}
        >
          {currentTab === 'overview' && (
            <DashboardOverview onNavigateTab={(tab) => setCurrentTab(tab as ActiveTab)} />
          )}
          {currentTab === 'institutions' && <InstitutionDirectory />}
          {currentTab === 'students' && <StudentDirectory />}
          {currentTab === 'qr_identity' && (
            <StudentQrIdentitySection onOpenProfile={() => setCurrentTab('students')} />
          )}
          {currentTab === 'enrolment' && <AcademicEnrolment />}
          {currentTab === 'import_wizard' && <BulkImportWizard />}
          {currentTab === 'import_history' && (
            <ImportHistory onNavigateImport={() => setCurrentTab('import_wizard')} />
          )}
          {currentTab === 'validation' && <ValidationFindings />}
          {currentTab === 'duplicates' && <DuplicateReview />}
          {currentTab === 'programmes' && <ProgrammeManagement />}
          {currentTab === 'intake' && <ApprovedIntakeMonitoring />}
          {currentTab === 'verification' && <VerificationCenter />}
          {currentTab === 'reports' && <InstitutionReports />}
          {currentTab === 'exports' && <ExportCenter />}
          {currentTab === 'audit' && <AuditTrail />}
          {currentTab === 'settings' && <SettingsAndIntegrations />}
        </AppShell>
      )}

      {/* Auth & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
