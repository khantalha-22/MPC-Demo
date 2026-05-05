import React, { useState } from 'react';
import './SummaryReview.css';
import { ChevronLeft, ChevronDown, ChevronUp, Globe, Clock, User, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SummaryReview: React.FC = () => {
  const { setMobileView, hasNewUser, attestationFlowType, walletPerms, selectedRoles } = useAppContext();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    if (expandedSection === id) {
      setExpandedSection(null);
    } else {
      setExpandedSection(id);
    }
  };

  const title = attestationFlowType === 'wallet' 
    ? 'Wallet Permissions Attestation' 
    : 'Role & Group Assignment Authority Attestation';

  const roleCount = 6 + (hasNewUser ? selectedRoles.length : 0);
  let whatContent = `Roles Attested: ${roleCount}`;
  
  const permStrings = [];
  if (walletPerms.erc20) permStrings.push(`ERC20 (Max $${walletPerms.erc20Amount})`);
  if (walletPerms.erc721) permStrings.push(`ERC721 (${walletPerms.erc721Tokens.join(', ')})`);
  if (walletPerms.burnVdt) permStrings.push(`Burn VDT (${walletPerms.burnVdtTokens.join(', ')})`);
  if (walletPerms.signing) permStrings.push('Signing');

  if (attestationFlowType === 'wallet') {
    whatContent = `Wallet Permissions Confirmed: ${permStrings.length > 0 ? permStrings.join(', ') : 'None'}`;
  } else if (hasNewUser && permStrings.length > 0) {
    whatContent += `\nWallet Permissions Confirmed: ${permStrings.join(', ')}`;
  }

  const sections = [
    {
      id: 'where',
      icon: <Globe size={18} />,
      title: 'Where',
      content: 'Location Data: 40.7128° N, 74.0060° W\nIP Address: 192.168.1.104'
    },
    {
      id: 'when',
      icon: <Clock size={18} />,
      title: 'When',
      content: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, 11:15 AM (EST)`
    },
    {
      id: 'who',
      icon: <User size={18} />,
      title: 'Who',
      content: 'Officer Name: Jane Doe\nFace Scan Confirmed: Yes'
    },
    {
      id: 'what',
      icon: <FileText size={18} />,
      title: 'What',
      content: whatContent
    }
  ];

  return (
    <div className="summary-review">
      <div className="ad-header m-header">
        <ChevronLeft size={24} className="m-back" onClick={() => setMobileView('M5')} />
      </div>
      
      <div className="ad-title-container">
        {title}
      </div>

      <div className="sr-intro">
        This is the information that has been collected. Please review the details below.
      </div>

      <div className="sr-content">
        {sections.map(section => (
          <div className="sr-accordion" key={section.id}>
            <div className="sr-acc-header" onClick={() => toggleSection(section.id)}>
              <div className="sr-acc-left">
                <div className="sr-icon-circle">{section.icon}</div>
                {section.title}
              </div>
              {expandedSection === section.id ? 
                <ChevronUp size={20} color="#4CAF50" /> : 
                <ChevronDown size={20} color="#4CAF50" />
              }
            </div>
            
            {expandedSection === section.id && (
              <div className="sr-acc-body">
                {section.content.split('\n').map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sr-footer">
        <button className="m-btn-outline" onClick={() => setMobileView('M1')} style={{ color: '#4CAF50', borderColor: '#4CAF50' }}>Close</button>
        <button className="m-btn-primary" onClick={() => setMobileView('M7')}>Continue</button>
      </div>
    </div>
  );
};
