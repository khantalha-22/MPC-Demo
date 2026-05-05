import React from 'react';
import './ModeSelection.css';
import { LayoutList, GitFork } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ModeSelection: React.FC = () => {
  const { setDemoOption } = useAppContext();

  return (
    <div className="mode-selection-container">
      <div className="mode-selection-box">
        <h1 className="ms-title">Select Demo Flow</h1>
        <p className="ms-desc">Please choose which demo scenario you would like to experience.</p>
        
        <div className="ms-options">
          <div className="ms-option-card" onClick={() => setDemoOption('option2')}>
            <div className="ms-icon-wrap">
              <GitFork size={32} color="#3B82F6" />
            </div>
            <h3>Option 1 (Separated Flow)</h3>
            <p>Admin is invited with Roles only (Task 1). Wallet Permissions are established later via a separate task (Task 2).</p>
          </div>

          <div className="ms-option-card" onClick={() => setDemoOption('option1')}>
            <div className="ms-icon-wrap">
              <LayoutList size={32} color="#10B981" />
            </div>
            <h3>Option 2 (Current Flow)</h3>
            <p>Admin is invited with Role and Wallet Permissions simultaneously. A single attestation task covers both.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
