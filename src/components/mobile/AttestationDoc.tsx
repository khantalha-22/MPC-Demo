import React from 'react';
import './AttestationDoc.css';
import { ChevronLeft, PenLine } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AttestationDoc: React.FC = () => {
  const { setMobileView, attestationFlowType, walletPerms, selectedRoles, currentAdmin } = useAppContext();

  const adminName = currentAdmin?.name || 'New Administrator';
  const adminEmail = currentAdmin?.email || 'Email not provided';

  const title = attestationFlowType === 'wallet' 
    ? 'Wallet Permissions Attestation' 
    : 'Admin Onboarding & Authority Attestation';

  const intro = attestationFlowType === 'wallet'
    ? `As a designated officer of [Organization Name], I attest that the wallet permissions defined herein accurately represent the authorization granted to ${adminName}.`
    : `As a designated officer of [Organization Name], I attest that the roles and group assignments defined herein accurately represent the onboarding configuration for ${adminName}.`;

  let sections: any[] = [];

  const allPossibleRoles = [
    {
      id: 'pactvera_admin',
      title: 'Pactvera Administrators',
      desc: 'Manages access and organization of agreements and templates, but cannot send or sign Pactveras.'
    },
    {
      id: 'pactvera_sender',
      title: 'Pactvera Sender',
      desc: 'Creates and sends Pactveras within approved folders, without signing or releasing value.'
    },
    {
      id: 'pactvera_signer',
      title: 'Pactvera Signer',
      desc: 'Reviews and signs Pactveras on behalf of the organization with legal authority.'
    },
    {
      id: 'tca_releasers',
      title: 'TCA Releasers',
      desc: 'Authorizes the release of funds or assets (TCAs) tied to a Pactvera agreement.'
    },
    {
      id: 'kyb_verifier',
      title: 'KYB Verifier',
      desc: 'Completes KYB verifications and shares verified organization details.'
    },
    {
      id: 'org_admin',
      title: 'Organization Admin',
      desc: 'Manages the organization\'s account, users, roles, and settings.'
    },
    {
      id: 'product_transfers',
      title: 'Product Transfers',
      desc: 'Authorized to transfer tokenized products on behalf of the organization.'
    }
  ];

  const getWalletItems = () => {
    const items = [];
    if (walletPerms.erc20) {
      items.push({ name: 'Transfers — ERC20', email: `Max Limit: $${walletPerms.erc20Amount}` });
    }
    if (walletPerms.erc721) {
      items.push({ name: 'Transfers — ERC721', email: `Permitted: ${walletPerms.erc721Tokens.join(', ')}` });
    }
    if (walletPerms.burnVdt) {
      items.push({ name: 'Burn VDT Authority', email: `Permitted: ${walletPerms.burnVdtTokens.join(', ')}` });
    }
    if (walletPerms.signing) {
      items.push({ name: 'Pactvera signing', email: 'Full Authority Enabled' });
    }
    return items;
  };

  if (attestationFlowType === 'wallet') {
    const walletItems = getWalletItems();
    sections = [
      {
        id: 'wallet_perms',
        title: 'Granted Permissions',
        desc: `The following wallet permissions have been assigned to ${adminName}:`,
        members: walletItems.length > 0 ? walletItems : [{ name: 'No Specific Permissions', email: 'Only basic view access' }]
      }
    ];
  } else {
    // Invite flow: Roles + Wallet Perms (if any)
    const roleSections = allPossibleRoles.map(role => {
      const isSelected = selectedRoles.includes(role.id);
      if (isSelected) {
        return {
          ...role,
          members: [{ name: adminName, email: adminEmail }]
        };
      }
      return null;
    }).filter(s => s !== null);

    const walletItems = getWalletItems();
    const walletSection = walletItems.length > 0 ? [{
      id: 'wallet_perms',
      title: 'Wallet Authority',
      desc: `In addition to the roles above, ${adminName} is granted the following wallet permissions:`,
      members: walletItems
    }] : [];

    sections = [...roleSections, ...walletSection];
  }

  return (
    <div className="attestation-doc">
      <div className="ad-header m-header">
        <ChevronLeft size={24} className="m-back" onClick={() => setMobileView('M3')} />
      </div>
      
      <div className="ad-title-container">
        {title}
      </div>

      <div className="ad-content">
        <div className="ad-intro">
          {intro}
        </div>

        <div className="ad-accordion-container">
          {sections.map(section => (
            <div className="ad-accordion always-open" key={section.id}>
              <div className="ad-acc-header">
                <div className="ad-acc-header-left">
                  {section.title}
                </div>
              </div>
              
              <div className="ad-acc-body">
                <div className="ad-acc-desc">{section.desc}</div>
                {section.members.map((member: any, idx: number) => (
                  <div className="ad-acc-member" key={idx}>
                    <div className="ad-acc-member-dot"></div>
                    <div className="ad-acc-member-info">
                      <span className="ad-acc-member-name">{member.name}</span>
                      {member.email && <span className="ad-acc-member-email">{member.email}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ad-signature-section">
          <div className="ad-sig-label">Signature</div>
          <div className="ad-sig-box" onClick={() => setMobileView('M5')}>
            <div className="ad-sig-icon">
              <PenLine size={14} color="#4CAF50" />
            </div>
            <span className="ad-sig-text">Click to sign</span>
          </div>
        </div>
      </div>

      <div className="ad-footer">
        <button className="m-btn-danger-outline" onClick={() => setMobileView('M1')}>Reject</button>
        <button className="m-btn-primary" onClick={() => setMobileView('M5')}>Continue</button>
      </div>
    </div>
  );
};
