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
import { AdminDetail } from './components/AdminDetail';
import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { phase, setPhase, webView, isInviteModalOpen, demoOption } = useAppContext();

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
            {webView === 'USER_DETAIL' && <AdminDetail />}
          </div>
          

        </div>
        {isInviteModalOpen && <InviteModal />}
      </div>

      <div className={`mobile-phase-container ${phase === 'SPLIT' ? 'visible' : ''}`}>
        <button className="close-mobile-btn" onClick={() => setPhase('WEB')}>
          <X size={24} />
        </button>
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
