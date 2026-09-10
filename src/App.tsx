import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { InspectionProvider } from './context/InspectionContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import { InspectorLayout } from './layouts/InspectorLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';

// Inspector Statutory Pages
import { ComplianceDashboard } from './pages/inspector/ComplianceDashboard';
import { LivePackageScannerPage } from './pages/inspector/LivePackageScannerPage';
import { AnalyzingPackagePage } from './pages/inspector/AnalyzingPackagePage';
import { ExtractedInfoPage } from './pages/inspector/ExtractedInfoPage';
import { ComplianceScorePage } from './pages/inspector/ComplianceScorePage';
import { StatutoryRuleDetailPage } from './pages/inspector/StatutoryRuleDetailPage';
import { ComplianceReportsPage } from './pages/inspector/ComplianceReportsPage';
import { InspectionHistoryPage } from './pages/inspector/InspectionHistoryPage';
import { InspectionDetailPage } from './pages/inspector/InspectionDetailPage';
import { RulebookPage } from './pages/inspector/RulebookPage';
import { InspectorProfilePage } from './pages/inspector/InspectorProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SupervisorDossierPage } from './pages/admin/SupervisorDossierPage';
import { SupervisorDirectory } from './pages/admin/SupervisorDirectory';
import { SupervisorDetails } from './pages/admin/SupervisorDetails';
import { DutyStatusPage } from './pages/admin/DutyStatusPage';
import { ActivityInspectionInfo } from './pages/admin/ActivityInspectionInfo';
import { SystemConfigurationPage } from './pages/admin/SystemConfigurationPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

const RootRedirector: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  return <Navigate to="/compliance-dashboard" replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InspectionProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Login Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/officer-login" element={<LoginPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />

              {/* Root Dispatcher */}
              <Route path="/" element={<RootRedirector />} />

              {/* Inspector / Field Enforcement Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['inspector']} />}>
                <Route element={<InspectorLayout />}>
                  {/* Canonical PRD Routes */}
                  <Route path="/compliance-dashboard" element={<ComplianceDashboard />} />
                  <Route path="/live-package-scanner" element={<LivePackageScannerPage />} />
                  <Route path="/analyzing-package" element={<AnalyzingPackagePage />} />
                  <Route path="/extracted-info" element={<ExtractedInfoPage />} />
                  <Route path="/compliance-score" element={<ComplianceScorePage />} />
                  <Route path="/statutory-rule-detail" element={<StatutoryRuleDetailPage />} />
                  <Route path="/statutory-rule-detail/:ruleId" element={<StatutoryRuleDetailPage />} />
                  <Route path="/compliance-reports" element={<ComplianceReportsPage />} />
                  <Route path="/compliance-reports/:id" element={<ComplianceReportsPage />} />
                  <Route path="/audit-history" element={<InspectionHistoryPage />} />
                  <Route path="/audit-history/:id" element={<InspectionDetailPage />} />
                  <Route path="/statutory-rulebook" element={<RulebookPage />} />
                  <Route path="/officer-profile" element={<InspectorProfilePage />} />
                  <Route path="/change-password" element={<ChangePasswordPage />} />

                  {/* Backward-Compatible Prefix Routes */}
                  <Route path="/inspector" element={<Navigate to="/compliance-dashboard" replace />} />
                  <Route path="/inspector/dashboard" element={<ComplianceDashboard />} />
                  <Route path="/inspector/inspect" element={<LivePackageScannerPage />} />
                  <Route path="/inspector/history" element={<InspectionHistoryPage />} />
                  <Route path="/inspector/history/:id" element={<InspectionDetailPage />} />
                  <Route path="/inspector/rulebook" element={<RulebookPage />} />
                  <Route path="/inspector/profile" element={<InspectorProfilePage />} />
                </Route>
              </Route>

              {/* Administrator / HQ Controller Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                  {/* Canonical PRD Routes */}
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/supervisor-dossier" element={<SupervisorDossierPage />} />
                  <Route path="/supervisor-dossier/:id" element={<SupervisorDossierPage />} />
                  <Route path="/inspections-activity" element={<ActivityInspectionInfo />} />
                  <Route path="/enforcement-duty" element={<DutyStatusPage />} />
                  <Route path="/zonal-supervisors" element={<SupervisorDirectory />} />
                  <Route path="/zonal-supervisors/:id" element={<SupervisorDossierPage />} />
                  <Route path="/system-configuration" element={<SystemConfigurationPage />} />
                  <Route path="/admin-profile" element={<AdminProfilePage />} />

                  {/* Backward-Compatible Prefix Routes */}
                  <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/supervisors" element={<SupervisorDirectory />} />
                  <Route path="/admin/supervisors/:id" element={<SupervisorDetails />} />
                  <Route path="/admin/duty-status" element={<DutyStatusPage />} />
                  <Route path="/admin/activity" element={<ActivityInspectionInfo />} />
                  <Route path="/admin/profile" element={<AdminProfilePage />} />
                  <Route path="/admin/system-settings" element={<SystemConfigurationPage />} />
                </Route>
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </InspectionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
