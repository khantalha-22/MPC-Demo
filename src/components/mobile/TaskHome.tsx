import React from 'react';
import './TaskHome.css';
import { ChevronLeft, Search, MoreVertical, ChevronRight, Home, ListTodo, Folder, Clock, QrCode } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const TaskHome: React.FC = () => {
  const { setMobileView, attestationFlowType } = useAppContext();

  const title = attestationFlowType === 'wallet' 
    ? 'Wallet Permissions Attestation' 
    : 'Role & Group Assignment Authority Attestation';
    
  const desc = attestationFlowType === 'wallet'
    ? 'Please review and attest the wallet permissions for KK ORG admins.'
    : 'Please review and attest the role and group assignment for KK ORG.';

  return (
    <div className="task-home">
      <div className="th-header">
        <ChevronLeft size={24} />
        <div className="th-title">My Tasks</div>
      </div>
      
      <div className="th-tabs-container">
        <div className="th-tabs">
          <div className="th-tab active">To Do</div>
          <div className="th-tab">Completed</div>
        </div>
      </div>
      
      <div className="th-search">
        <Search size={18} color="#aaa" />
        <input type="text" placeholder="Search" />
      </div>
      
      <div className="th-content">
        <div className="task-card" onClick={() => setMobileView('M2')}>
          <div className="tc-header">
            <div className="tc-title">{title}</div>
            <MoreVertical size={18} color="#aaa" />
          </div>
          <div className="tc-desc">
            {desc}
          </div>
          <div className="tc-req">
            Requested by ABC Lending
          </div>
          <div className="tc-footer">
            <div>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div className="tc-start">Start Task <ChevronRight size={16} /></div>
          </div>
        </div>
      </div>
      
      <div className="bottom-nav">
        <div className="nav-item active">
          <Home size={22} />
          <span>Home</span>
        </div>
        <div className="nav-item">
          <ListTodo size={22} />
          <span>My Tasks</span>
        </div>
        
        <div className="qr-btn-container">
          <div className="qr-btn">
            <QrCode size={28} />
          </div>
        </div>
        
        <div className="nav-item">
          <Folder size={22} />
          <span>My Collection</span>
        </div>
        <div className="nav-item">
          <Clock size={22} />
          <span>History</span>
        </div>
      </div>
    </div>
  );
};
