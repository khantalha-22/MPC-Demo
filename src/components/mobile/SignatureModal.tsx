import React, { useState } from 'react';
import './SignatureModal.css';
import { X, PenLine, Type, Upload } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SignatureModal: React.FC = () => {
  const { setMobileView } = useAppContext();
  const [isDrawn, setIsDrawn] = useState(false);

  return (
    <div className="signature-modal">
      <div className="sm-sheet">
        <div className="sm-header">
          <div className="sm-title">Signature</div>
          <X size={20} className="sm-close" onClick={() => setMobileView('M4')} />
        </div>
        
        <div className="sm-tabs">
          <div className="sm-tab active">
            <PenLine size={16} /> Draw
          </div>
          <div className="sm-tab">
            <Type size={16} /> Type
          </div>
          <div className="sm-tab">
            <Upload size={16} /> Upload
          </div>
        </div>
        
        <div className="sm-canvas-container" onClick={() => setIsDrawn(true)}>
          {isDrawn ? (
            <svg viewBox="0 0 400 200" className="sm-canvas">
              <path 
                d="M 50 100 Q 100 50 150 120 T 250 80 T 350 130" 
                fill="none" 
                stroke="#111" 
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <div style={{width: '100%', height: '100%'}}></div>
          )}
          <div className="sm-clear" onClick={(e) => { e.stopPropagation(); setIsDrawn(false); }}>
            Clear Signature
          </div>
        </div>
        
        <div className="sm-footer">
          <button className="m-btn-outline" onClick={() => setMobileView('M4')}>Cancel</button>
          <button 
            className="m-btn-primary" 
            onClick={() => setMobileView('M6')}
            disabled={!isDrawn}
            style={{ opacity: isDrawn ? 1 : 0.5 }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
