import React from 'react';
import './Complete.css';
import { CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Complete: React.FC = () => {
  const { finishMobileFlow } = useAppContext();

  return (
    <div className="complete-view">
      <div className="cv-content">
        <div className="cv-icon">
          <CheckCircle size={80} color="#4CAF50" />
        </div>
        <div className="cv-title">Attestation Complete</div>
        <div className="cv-desc">
          Your biometric consent and document signature have been securely recorded.
        </div>
        <div className="cv-subdesc">
          The task has been moved to your Completed tab.
        </div>
      </div>

      <div className="cv-footer">
        <button className="m-btn-primary" onClick={finishMobileFlow}>Return to Dashboard</button>
      </div>
    </div>
  );
};
