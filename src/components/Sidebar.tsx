import React from 'react';
import './Sidebar.css';
import { useAppContext } from '../context/AppContext';
import { Hexagon, LayoutDashboard, FileText, Book, ShieldCheck, User, CreditCard, Bell, Phone, ChevronDown, Moon, Sun } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { webView, setWebView, demoOption, resetDemo } = useAppContext();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Hexagon size={24} color="white" fill="#8bc34a" />
        ChainIT
      </div>

      <div className="sidebar-section">
        <div className="sidebar-nav">
          <div 
            className={`sidebar-item ${webView === 'DASHBOARD' ? 'active' : ''}`}
            onClick={() => setWebView('DASHBOARD')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </div>
          <div className="sidebar-item">
            <FileText size={18} />
            Reports
          </div>
          <div className="sidebar-item has-dropdown">
            <div className="sidebar-item-content">
              <Book size={18} />
              Ledgers
            </div>
            <ChevronDown size={16} />
          </div>
          <div className="sidebar-item has-dropdown">
            <div className="sidebar-item-content">
              <ShieldCheck size={18} />
              Reverifications
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">GENERAL</div>
        <div className="sidebar-nav">
          <div 
            className={`sidebar-item has-dropdown ${webView === 'USER_MANAGEMENT' || webView === 'WALLET_PERMISSIONS' ? 'active' : ''}`}
            onClick={() => setWebView('USER_MANAGEMENT')}
          >
            <div className="sidebar-item-content">
              <User size={18} />
              Users Management
            </div>
            {demoOption === 'option2' && <ChevronDown size={16} className={(webView === 'USER_MANAGEMENT' || webView === 'WALLET_PERMISSIONS') ? 'rotate-180' : ''} />}
          </div>

          {demoOption === 'option2' && (webView === 'USER_MANAGEMENT' || webView === 'WALLET_PERMISSIONS') && (
            <div className="sidebar-sub-menu">
              <div 
                className={`sidebar-sub-item ${webView === 'WALLET_PERMISSIONS' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setWebView('WALLET_PERMISSIONS');
                }}
              >
                <div className="sub-item-connector">
                  <div className="connector-line-vertical"></div>
                  <div className="connector-line-horizontal"></div>
                  <div className="connector-dot"></div>
                </div>
                <div className="sub-item-text">
                  Manage Wallet Permissions
                </div>
              </div>
            </div>
          )}
          <div className="sidebar-item">
            <CreditCard size={18} />
            Subscriptions
          </div>
          <div className="sidebar-item">
            <Bell size={18} />
            Notifications
          </div>
          <div className="sidebar-item">
            <Phone size={18} />
            Contact Us
          </div>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div className="theme-toggle">
          <div className="theme-btn"><Moon size={14} /> Dark</div>
          <div className="theme-btn active"><Sun size={14} /> Light</div>
        </div>
        <div className="sidebar-footer-bottom">
          <div className="version-text">v1.4.9</div>
          <div className="home-btn" onClick={resetDemo}>
            <Hexagon size={14} fill="#8bc34a" color="#8bc34a" />
            Home
          </div>
        </div>
      </div>
    </div>
  );
};
