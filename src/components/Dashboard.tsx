import React from 'react';
import './Dashboard.css';
import { ListTodo, CheckCircle2, FileText, History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { demoOption, inviteFlowCompleted, setWebView } = useAppContext();

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="section-title">
        <ListTodo size={18} />
        My Tasks
      </div>

      {demoOption === 'option2' && inviteFlowCompleted && (
        <div className="card" style={{ borderColor: '#FF9800', boxShadow: '0 0 10px rgba(255, 152, 0, 0.1)' }}>
          <div className="card-header">
            <div className="card-title" style={{ color: '#FF9800' }}>Establish Wallet Permissions</div>
            <div className="badge" style={{ background: 'rgba(255, 152, 0, 0.2)', color: '#FF9800' }}>ACTION REQUIRED</div>
          </div>
          
          <div className="task-list">
            <div className="task-row">
              <div className="task-info incomplete">
                <div className="task-number" style={{ background: '#FF9800', borderColor: '#FF9800', color: '#000' }}>!</div>
                Assign wallet permissions to newly invited admin
              </div>
              <button className="btn-outline" style={{ borderColor: '#FF9800', color: '#FF9800' }} onClick={() => setWebView('WALLET_PERMISSIONS')}>Start Task</button>
            </div>
          </div>
        </div>
      )}



      <div className="card">
        <div className="card-header">
          <div className="card-title">Verify Documents from Secretary of State</div>
          <div className="badge pending">PENDING</div>
        </div>
        
        <div className="task-list-header">
          <span>Sub-Tasks</span>
          <span>0/4 Tasks Completed</span>
        </div>

        <div className="task-list">
          {[1, 2, 3, 4].map((num) => (
            <div className="task-row" key={num}>
              <div className="task-info incomplete">
                <div className="task-number">{num}</div>
                Verify Secretary of State Document - Initial_filing
              </div>
              <button className="btn-outline">Start Task</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-cards">
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div className="bottom-card-title">
              <FileText size={16} /> My Org ID
            </div>
            <span className="link-text">View more</span>
          </div>
          
          <div className="org-id-box">
            <div className="org-avatar">K</div>
            <div className="org-name">KK ORG</div>
          </div>
          
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Account Status</span>
              <span className="status-value">ACTIVE</span>
            </div>
            <div className="status-item">
              <span className="status-label">Verification Status</span>
              <span className="status-value">VERIFIED</span>
            </div>
            <div className="status-item">
              <span className="status-label">UBO Verification Status</span>
              <span className="status-value">NOT VERIFIED</span>
            </div>
          </div>
        </div>
        
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div className="bottom-card-title">
              <History size={16} /> Recent Activity
            </div>
            <span className="link-text">View all</span>
          </div>
          
          <div className="activity-list">
            <div className="activity-item">
              <CheckCircle2 size={16} className="activity-icon" />
              <div>
                <div className="activity-text">KK ORG was successfully verified through the Secretary of State.</div>
                <div className="activity-date">05/04/2026 04:21 PM</div>
              </div>
            </div>
            <div className="activity-item">
              <CheckCircle2 size={16} className="activity-icon" />
              <div>
                <div className="activity-text">KK ORG completed business onboarding.</div>
                <div className="activity-date">05/04/2026 04:21 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
