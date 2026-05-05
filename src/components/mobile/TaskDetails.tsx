import React, { useState } from 'react';
import './TaskDetails.css';
import { ChevronLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const TaskDetails: React.FC = () => {
  const { setMobileView, attestationFlowType } = useAppContext();
  const [consented, setConsented] = useState(false);

  const title = attestationFlowType === 'wallet' 
    ? 'Wallet Permissions Attestation' 
    : 'Role & Group Assignment Authority Attestation';
    
  const desc = attestationFlowType === 'wallet'
    ? 'Please review and attest the wallet permissions for KK ORG admins.'
    : 'Please review and attest the role and group assignment for KK ORG.';

  return (
    <div className="task-details">
      <div className="m-header">
        <ChevronLeft size={24} className="m-back" onClick={() => setMobileView('M1')} />
        <div className="m-title">Task Details</div>
      </div>
      
      <div className="td-intro">
        To proceed, please review the details below and provide your consent for biometric use.
      </div>
      
      <div className="td-content">
        <div className="td-field">
          <div className="td-label">Task</div>
          <div className="td-value">{title}</div>
        </div>
        
        <div className="td-field">
          <div className="td-label">Description</div>
          <div className="td-value normal">{desc}</div>
        </div>
        
        <div className="td-field">
          <div className="td-label">Requested By</div>
          <div className="td-value">ABC Lending</div>
        </div>
        
        <div className="td-field">
          <div className="td-label">Requested At</div>
          <div className="td-value">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, 11:05 AM (EST)</div>
        </div>
      </div>
      
      <div className="td-consent">
        <div className="consent-checkbox-row">
          <input 
            type="checkbox" 
            checked={consented} 
            onChange={(e) => setConsented(e.target.checked)} 
          />
          <div className="consent-text">
            By continuing, you consent to the collection and use of your facial biometric data. 
            This data will be used only to verify your identity and prevent fraud. 
            Your data is stored securely in accordance with our <span className="privacy-link">Privacy Policy</span>.
          </div>
        </div>
        
        <button 
          className="m-btn-primary" 
          disabled={!consented}
          style={{ opacity: consented ? 1 : 0.5 }}
          onClick={() => setMobileView('M3')}
        >
          I Consent
        </button>
        <span className="privacy-btn-link">View Privacy Policy</span>
      </div>
    </div>
  );
};
