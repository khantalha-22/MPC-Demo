import React, { useState } from 'react';
import './WalletPermissionsPage.css';
import { ChevronDown, Shield, Info, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const WalletPermissionsPage: React.FC = () => {
  const { setPhase, setAttestationFlowType, setWalletPerms, admins } = useAppContext();
  
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Wallet Permissions
  const [permErc20, setPermErc20] = useState(false);
  const [erc20Amount, setErc20Amount] = useState('50000');
  const [permErc721, setPermErc721] = useState(false);
  const [erc721Tokens, setErc721Tokens] = useState<string[]>(['Product VDT']);
  const [permBurn, setPermBurn] = useState(false);
  const [burnTokens, setBurnTokens] = useState<string[]>(['Pactvera VDT']);
  const [permSign, setPermSign] = useState(false);

  const isFormValid = selectedAdmin !== '';

  const handleSavePermissions = () => {
    if (isFormValid) {
      setWalletPerms({
        erc20: permErc20,
        erc20Amount,
        erc721: permErc721,
        erc721Tokens,
        burnVdt: permBurn,
        burnVdtTokens: burnTokens,
        signing: permSign
      });
      setAttestationFlowType('wallet');
      setPhase('SPLIT');
    }
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

  const selectedAdminDetails = admins.find(a => a.id === selectedAdmin);

  const getRoleLabel = (id: string) => {
    const roleMap: Record<string, string> = {
      'product_transfers': 'Product Transfers',
      'pactvera_admin': 'Pactvera Admin',
      'pactvera_signer': 'Pactvera Signer',
      'tca_release': 'TCA Release',
      'kyb_verifier': 'KYB Verifier',
      'org_admin': 'Org Admin'
    };
    return roleMap[id] || id;
  };

  return (
    <div className="wp-page">
      <div className="wp-header">
        <div className="wp-header-left">
          <div className="wp-title-row">
            <Shield size={24} className="wp-title-icon" />
            <h1 className="wp-title">Manage Wallet Permissions</h1>
          </div>
          <p className="wp-subtitle">Assign and establish wallet authority for organization administrators.</p>
        </div>
        <div className="wp-header-actions">
          <button className="btn-secondary">Cancel</button>
          <button 
            className="btn-primary" 
            disabled={!isFormValid}
            onClick={handleSavePermissions}
          >
            Save & Establish Permissions
          </button>
        </div>
      </div>

      <div className="wp-content-container">
        <div className="wp-main-card">
          <div className="wp-section">
            <h2 className="wp-section-title">Select Administrator</h2>
            <p className="wp-section-desc">Choose the administrator you want to grant wallet permissions to.</p>
            
            <div className="wp-form-group">
              <label className="wp-label">Administrator<span>*</span></label>
              <div className="wp-dropdown-container">
                <div className="wp-dropdown-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {selectedAdminDetails ? (
                    <div className="wp-selected-admin">
                      <span className="wp-admin-name">{selectedAdminDetails.name}</span>
                      <span className="wp-admin-email">{selectedAdminDetails.email}</span>
                    </div>
                  ) : 'Choose Admin'}
                  <ChevronDown size={18} />
                </div>
                
                {isDropdownOpen && (
                  <div className="wp-dropdown-list">
                    {admins.map(admin => (
                      <div 
                        key={admin.id} 
                        className={`wp-admin-option ${selectedAdmin === admin.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedAdmin(admin.id);
                          setIsDropdownOpen(false);
                          if (admin.walletPerms) {
                            setPermErc20(admin.walletPerms.erc20);
                            setErc20Amount(admin.walletPerms.erc20Amount);
                            setPermErc721(admin.walletPerms.erc721);
                            setErc721Tokens(admin.walletPerms.erc721Tokens);
                            setPermBurn(admin.walletPerms.burnVdt);
                            setBurnTokens(admin.walletPerms.burnVdtTokens);
                            setPermSign(admin.walletPerms.signing);
                          }
                        }}
                      >
                        <div className="wp-admin-info">
                          <div className="wp-admin-name">{admin.name}</div>
                          <div className="wp-admin-meta">{admin.email} • {admin.roles.map(getRoleLabel).join(', ')}</div>
                        </div>
                        {selectedAdmin === admin.id && <Check size={16} color="#8bc34a" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="wp-divider"></div>

          <div className="wp-section">
            <h2 className="wp-section-title">Configure Permissions</h2>
            <p className="wp-section-desc">Define specific wallet actions and granular limits for this administrator.</p>
            
            <div className="wp-permissions-grid">
              <div className="wp-perm-group">
                <div className="wp-perm-header">
                  <h3 className="wp-perm-title">Transfers & Assets</h3>
                  <div className="wp-info-tag">
                    <Info size={12} />
                    On-chain actions
                  </div>
                </div>
                
                <div className="wp-perm-item-container">
                  <div className="wp-perm-item">
                    <label className="wp-checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={permErc20}
                        onChange={(e) => setPermErc20(e.target.checked)}
                      />
                      <span className="wp-checkmark"></span>
                      <div className="wp-perm-text">
                        <div className="wp-perm-label">Authorize transfer of ERC20 tokens</div>
                        <div className="wp-perm-subtext">Allows moving fungible tokens (e.g. USDC, ETH)</div>
                      </div>
                    </label>
                  </div>
                  <div className="wp-config-box">
                    <label className="wp-config-label">Max Transfer Amount (per transaction)</label>
                    <div className="wp-config-input-wrapper">
                      <span className="wp-currency-prefix">$</span>
                      <input 
                        type="number" 
                        className="wp-config-input"
                        value={erc20Amount}
                        onChange={(e) => setErc20Amount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="wp-perm-item-container">
                  <div className="wp-perm-item">
                    <label className="wp-checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={permErc721}
                        onChange={(e) => setPermErc721(e.target.checked)}
                      />
                      <span className="wp-checkmark"></span>
                      <div className="wp-perm-text">
                        <div className="wp-perm-label">Authorize transfer of ERC721 tokens</div>
                        <div className="wp-perm-subtext">Allows moving NFTs or tokenized products</div>
                      </div>
                    </label>
                  </div>
                  <div className="wp-config-box">
                    <label className="wp-config-label">Permitted Token Types</label>
                    <div className="wp-token-chip-group">
                      {['Product VDT', 'Ticket VDT'].map(token => (
                        <div 
                          key={token} 
                          className={`wp-token-chip ${erc721Tokens.includes(token) ? 'active' : ''}`}
                          onClick={() => toggleErc721Token(token)}
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="wp-perm-group">
                <div className="wp-perm-header">
                  <h3 className="wp-perm-title">Organization Authority</h3>
                </div>

                <div className="wp-perm-item-container">
                  <div className="wp-perm-item">
                    <label className="wp-checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={permBurn}
                        onChange={(e) => setPermBurn(e.target.checked)}
                      />
                      <span className="wp-checkmark"></span>
                      <div className="wp-perm-text">
                        <div className="wp-perm-label">Authorize burning of Validated Data Tokens</div>
                        <div className="wp-perm-subtext">Critical action: Permanently removes tokens from circulation</div>
                      </div>
                    </label>
                  </div>
                  <div className="wp-config-box">
                    <label className="wp-config-label">VDTs Permitted for Burning</label>
                    <div className="wp-token-grid">
                      {[
                        'Pactvera VDT', 'Credential VDT'
                      ].map(token => (
                        <label key={token} className="wp-token-checkbox-item">
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

                <div className="wp-perm-item-container">
                  <div className="wp-perm-item">
                    <label className="wp-checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={permSign}
                        onChange={(e) => setPermSign(e.target.checked)}
                      />
                      <span className="wp-checkmark"></span>
                      <div className="wp-perm-text">
                        <div className="wp-perm-label">Allow Pactvera signing</div>
                        <div className="wp-perm-subtext">Allows signing on behalf of the organization</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wp-side-info">
          <div className="wp-info-card">
            <h4 className="wp-info-card-title">Attestation Process</h4>
            <p className="wp-info-card-text">Saving these permissions will trigger a mobile attestation request. The admin will need to confirm these on their device using biometrics.</p>
            <div className="wp-process-steps">
              <div className="wp-step">
                <div className="wp-step-num">1</div>
                <div className="wp-step-text">Configure on Web</div>
              </div>
              <div className="wp-step">
                <div className="wp-step-num">2</div>
                <div className="wp-step-text">Mobile Notification</div>
              </div>
              <div className="wp-step">
                <div className="wp-step-num">3</div>
                <div className="wp-step-text">Biometric Consent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
