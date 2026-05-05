import React from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/UserManagement';
import { InviteModal } from './components/InviteModal';
import { PhoneFrame } from './components/PhoneFrame';
import { ModeSelection } from './components/ModeSelection';
import { WalletPermissionsPage } from './components/WalletPermissionsPage';
import { Maximize2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { phase, webView, isInviteModalOpen, demoOption } = useAppContext();

  if (demoOption === null) {
    return <ModeSelection />;
  }

  return (
    <div className="app-container">
      <div className={`web-phase-container ${phase === 'WEB' ? 'full' : 'split'}`}>
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="page-content">
            {webView === 'DASHBOARD' && <Dashboard />}
            {webView === 'USER_MANAGEMENT' && <UserManagement />}
            {webView === 'WALLET_PERMISSIONS' && <WalletPermissionsPage />}
          </div>
          
          <div className={`floating-pill ${webView === 'DASHBOARD' ? 'top-right' : 'bottom-left'}`}>
            <div className="floating-pill-header">
              <span>Onboarding Checklist</span>
              <Maximize2 size={14} color="#888" />
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill"></div>
            </div>
            <div className="progress-text">
              <span>83% Completed</span>
              <span>5 of 6 Steps Completed</span>
            </div>
          </div>
        </div>
        {isInviteModalOpen && <InviteModal />}
      </div>

      <div className={`mobile-phase-container ${phase === 'SPLIT' ? 'visible' : ''}`}>
        <PhoneFrame />
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
