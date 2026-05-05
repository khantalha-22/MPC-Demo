import React, { useState } from 'react';
import './FaceCapture.css';
import { ChevronLeft, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const FaceCapture: React.FC = () => {
  const { setMobileView } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMobileView('M4');
    }, 1500);
  };

  return (
    <div className="face-capture">
      <div className="fc-header m-header">
        <ChevronLeft size={24} className="m-back" onClick={() => setMobileView('M2')} />
      </div>
      
      <div className="fc-title-container">
        Role & Group Assignment Authority Attestation
      </div>

      <div className="fc-warning">
        <div className="fc-warning-title">
          <Info size={16} />
          Photosensitivity Warning
        </div>
        <div className="fc-warning-text">
          This video liveness check flashes different colors. Use caution if you are photosensitive.
        </div>
      </div>

      <div className="fc-instruction">Center your face</div>

      <div className="fc-oval-container">
        <div className="fc-placeholder">
          <div className="fc-icon-wrapper">
            <svg viewBox="0 0 24 24" width="140" height="140" fill="none" stroke="#bdbdbd" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </div>

      <div className="fc-footer">
        <button className="m-btn-primary" onClick={handleStart} disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Start Video Check'}
        </button>
      </div>
    </div>
  );
};
