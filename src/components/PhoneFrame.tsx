import React from 'react';
import './PhoneFrame.css';
import { Wifi, Battery, Signal } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Import mobile views
import { TaskHome } from './mobile/TaskHome';
import { TaskDetails } from './mobile/TaskDetails';
import { FaceCapture } from './mobile/FaceCapture';
import { AttestationDoc } from './mobile/AttestationDoc';
import { SignatureModal } from './mobile/SignatureModal';
import { SummaryReview } from './mobile/SummaryReview';
import { Complete } from './mobile/Complete';

export const PhoneFrame: React.FC = () => {
  const { mobileView } = useAppContext();

  const renderMobileView = () => {
    switch (mobileView) {
      case 'M1': return <TaskHome />;
      case 'M2': return <TaskDetails />;
      case 'M3': return <FaceCapture />;
      case 'M4': return <AttestationDoc />;
      case 'M5': return <SignatureModal />;
      case 'M6': return <SummaryReview />;
      case 'M7': return <Complete />;
      default: return <TaskHome />;
    }
  };

  return (
    <div className="phone-frame-wrapper">
      <div className="phone-screen">
        <div className="status-bar">
          <div className="time">9:41</div>
          <div className="status-bar-icons">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
        </div>
        
        <div className="mobile-content">
          {renderMobileView()}
        </div>
        
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
