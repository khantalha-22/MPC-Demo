import React, { useState, useEffect } from 'react';
import './InviteModal.css';
import { X, ChevronDown, Check, Lock, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ROLES = [
  { id: 'product_transfers', name: 'Product Transfers', desc: 'Can transfer tokenized products on behalf of the organization.' },
  { id: 'pactvera_admin', name: 'Pactvera Admin', desc: 'Can create, configure, and send Pactvera agreements on behalf of the organization.' },
  { id: 'pactvera_signer', name: 'Pactvera Signer', desc: 'Can complete and execute Pactvera agreements on behalf of the organization.' },
  { id: 'tca_release', name: 'TCA Release', desc: 'Can release value (TCAs) tied to a Pactvera agreement on behalf of the organization after conditions are met.' },
  { id: 'kyb_verifier', name: 'KYB Verifier', desc: 'Can complete KYB verification tasks on behalf of the organization.' },
  { id: 'org_admin', name: 'Organization Admin', desc: 'Can manage users, roles, and authority settings for the organization.' }
];

export const InviteModal: React.FC = () => {
  const { 
    setIsInviteModalOpen, 
    setPhase, 
    setHasNewUser, 
    demoOption,
    setWalletPerms: setGlobalWalletPerms,
    addAdmin,
    setSelectedRoles: setGlobalSelectedRoles
  } = useAppContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  
  // Wallet Permissions (for Step 2)
  const [permErc20, setPermErc20] = useState(false);
  const [erc20Amount, setErc20Amount] = useState('10000');
  const [permErc721, setPermErc721] = useState(false);
  const [erc721Tokens, setErc721Tokens] = useState<string[]>(['Product VDT']);
  const [permBurn, setPermBurn] = useState(false);
  const [burnTokens, setBurnTokens] = useState<string[]>(['Pactvera VDT']);
  const [permSign, setPermSign] = useState(false);

  const hasProductTransfers = selectedRoles.has('product_transfers');
  const hasPactveraRoles = selectedRoles.has('pactvera_admin') || selectedRoles.has('pactvera_signer');

  useEffect(() => {
    if (hasProductTransfers) {
      setPermErc721(true);
      if (!erc721Tokens.includes('Product VDT')) {
        setErc721Tokens(prev => [...prev, 'Product VDT']);
      }
    }
  }, [hasProductTransfers]);

  useEffect(() => {
    if (hasPactveraRoles) {
      setPermSign(true);
    }
  }, [hasPactveraRoles]);

  const toggleRole = (id: string) => {
    const newRoles = new Set(selectedRoles);
    if (newRoles.has(id)) {
      newRoles.delete(id);
    } else {
      newRoles.add(id);
    }
    setSelectedRoles(newRoles);
  };

  const toggleErc721Token = (token: string) => {
    setErc721Tokens(prev => 
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  const toggleBurnToken = (token: string) => {
    setBurnTokens(prev => 
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  const isStep1Valid = name.length > 2 && email.length > 5 && email.includes('@') && phoneNumber.length >= 10 && selectedRoles.size > 0;

  const handleNext = () => {
    if (demoOption === 'option1') {
      setCurrentStep(2);
    } else {
      handleSendInvite();
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSendInvite = () => {
    const walletPermissions = {
      erc20: permErc20,
      erc20Amount,
      erc721: permErc721,
      erc721Tokens,
      burnVdt: permBurn,
      burnVdtTokens: burnTokens,
      signing: permSign
    };

    setGlobalSelectedRoles(Array.from(selectedRoles));
    setGlobalWalletPerms(walletPermissions);
    
    addAdmin({
      name,
      email,
      phoneNumber,
      roles: Array.from(selectedRoles),
      walletPerms: walletPermissions
    });

    setHasNewUser(true);
    setIsInviteModalOpen(false);
    setPhase('SPLIT');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Invite New Admin</div>
          <button className="modal-close" onClick={() => setIsInviteModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {demoOption === 'option1' && (
          <div className="modal-stepper">
            <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-circle">{currentStep > 1 ? <Check size={14} /> : 1}</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`}></div>
            <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <div className="step-label">Wallet Permissions</div>
            </div>
          </div>
        )}

        <div className="modal-body">
          {currentStep === 1 ? (
            <>
              <div className="form-group">
                <label className="form-label">Full Name<span>*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address<span>*</span></label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number<span>*</span></label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="Enter phone number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role<span>*</span></label>
                <div className="dropdown-container">
                  <div className="dropdown-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {selectedRoles.size > 0 ? `${selectedRoles.size} Roles Selected` : 'Choose Role'}
                    <ChevronDown size={16} />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="dropdown-list">
                      {ROLES.map(role => (
                        <div 
                          key={role.id} 
                          className={`role-option ${selectedRoles.has(role.id) ? 'selected' : ''}`}
                          onClick={() => toggleRole(role.id)}
                        >
                          <input 
                            type="checkbox" 
                            className="checkbox" 
                            checked={selectedRoles.has(role.id)}
                            readOnly
                          />
                          <div className="role-info">
                            <div className="role-name">{role.name}</div>
                            <div className="role-desc">{role.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {hasProductTransfers && (
                  <div className="info-callout">
                    <Zap size={14} /> Wallet permission 'Transfers — ERC721' will be auto-enabled.
                  </div>
                )}
                {hasPactveraRoles && (
                  <div className="info-callout">
                    <Zap size={14} /> Wallet permission 'Allow Pactvera signing' will be auto-enabled.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="form-group">
              <label className="form-label">Wallet Permissions</label>
              <p className="form-helper-text">Define specific wallet actions and granular limits for this administrator.</p>
              
              <div className="wallet-perm-list">
                <div className="perm-section">
                  <div className="perm-row">
                    <input 
                      type="checkbox" 
                      className="checkbox" 
                      checked={permErc20}
                      onChange={(e) => setPermErc20(e.target.checked)}
                    />
                    Transfers — ERC20 tokens
                  </div>
                  <div className="perm-config-box">
                    <label className="config-label">Max Transfer Amount (per transaction)</label>
                    <div className="config-input-wrapper">
                      <span className="currency-prefix">$</span>
                      <input 
                        type="number" 
                        className="config-input"
                        value={erc20Amount}
                        onChange={(e) => setErc20Amount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="perm-section">
                  <div className={`perm-row ${hasProductTransfers ? 'locked' : ''}`}>
                    <input 
                      type="checkbox" 
                      className="checkbox" 
                      checked={permErc721}
                      onChange={(e) => !hasProductTransfers && setPermErc721(e.target.checked)}
                      disabled={hasProductTransfers}
                    />
                    Transfers — ERC721 tokens (VDTs)
                    {hasProductTransfers && <Lock size={14} className="locked-icon" />}
                  </div>
                  <div className="perm-config-box">
                    <label className="config-label">Permitted Token Types</label>
                    <div className="token-chip-group">
                      {['Product VDT', 'Ticket VDT'].map(token => (
                        <div 
                          key={token} 
                          className={`token-chip ${erc721Tokens.includes(token) ? 'active' : ''}`}
                          onClick={() => toggleErc721Token(token)}
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="perm-section">
                  <div className="perm-row">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={permBurn}
                      onChange={(e) => setPermBurn(e.target.checked)}
                    />
                    Burn VDT Authority
                  </div>
                  <div className="perm-config-box">
                    <label className="config-label">VDTs Permitted for Burning</label>
                    <div className="token-grid">
                      {[
                        'Pactvera VDT', 'Credential VDT'
                      ].map(token => (
                        <label key={token} className="token-checkbox-item">
                          <input 
                            type="checkbox" 
                            checked={burnTokens.includes(token)}
                            onChange={() => toggleBurnToken(token)}
                          />
                          {token}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="perm-section">
                  <div className="perm-row">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={permSign}
                      onChange={(e) => !hasPactveraRoles && setPermSign(e.target.checked)}
                      disabled={hasPactveraRoles}
                    />
                    Allow Pactvera signing
                    {hasPactveraRoles && <Lock size={14} className="locked-icon" />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {currentStep === 1 ? (
            <>
              <button className="btn-cancel" onClick={() => setIsInviteModalOpen(false)}>Cancel</button>
              <button 
                className="btn-primary" 
                disabled={!isStep1Valid}
                onClick={handleNext}
              >
                {demoOption === 'option2' ? 'Send Invite' : 'Next'}
              </button>
            </>
          ) : (
            <>
              <button className="btn-cancel" onClick={handleBack}>Back</button>
              <button 
                className="btn-primary" 
                onClick={handleSendInvite}
              >
                Send Invite
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
