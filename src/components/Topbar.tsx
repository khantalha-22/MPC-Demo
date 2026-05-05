import React from 'react';
import './Topbar.css';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Bell, Moon } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { webView } = useAppContext();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          <div className="back-button">
            <ArrowLeft size={14} />
          </div>
          {webView === 'DASHBOARD' ? 'Dashboard' : 'Administration > User Management'}
        </div>
      </div>
      
      <div className="topbar-right">
        <div className="org-switcher">
          <span className="org-badge">KO</span>
          KK ORG
        </div>
        
        <div className="icon-button">
          <Moon size={20} />
        </div>
        
        <div className="icon-button">
          <Bell size={20} />
          <div className="notification-badge">2</div>
        </div>
        
        <div className="user-profile">
          <div className="avatar">
            <img src="https://i.pravatar.cc/100?img=11" alt="User" />
          </div>
          <div className="user-info">
            <span className="user-name">TEST ALASKA</span>
            <span className="user-role">Individual User</span>
          </div>
        </div>
      </div>
    </div>
  );
};
