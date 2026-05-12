import React, { useState, useEffect } from 'react';
import './EditRolesModal.css';
import { X, ChevronDown, Lock, Zap } from 'lucide-react';

const ROLES = [
  { id: 'product_transfers', name: 'Product Transfers', desc: 'Can transfer tokenized products on behalf of the organization.' },
  { id: 'pactvera_admin', name: 'Pactvera Admin', desc: 'Can create, configure, and send Pactvera agreements on behalf of the organization.' },
  { id: 'pactvera_signer', name: 'Pactvera Signer', desc: 'Can complete and execute Pactvera agreements on behalf of the organization.' },
  { id: 'tca_release', name: 'TCA Release', desc: 'Can release value (TCAs) tied to a Pactvera agreement on behalf of the organization after conditions are met.' },
  { id: 'kyb_verifier', name: 'KYB Verifier', desc: 'Can complete KYB verification tasks on behalf of the organization.' },
  { id: 'org_admin', name: 'Organization Admin', desc: 'Can manage users, roles, and authority settings for the organization.' }
];

interface EditRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: {
    id: string;
    name: string;
    roles: string[];
    walletPerms: any;
  };
  onSave: (roles: string[], walletPerms: any) => void;
}

export const EditRolesModal: React.FC<EditRolesModalProps> = ({ isOpen, onClose, admin, onSave }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set(admin.roles));
  
  // Wallet Permissions
  const [permErc20, setPermErc20] = useState(admin.walletPerms.erc20);
  const [erc20Amount, setErc20Amount] = useState(admin.walletPerms.erc20Amount);
  const [permErc721, setPermErc721] = useState(admin.walletPerms.erc721);
  const [erc721Tokens, setErc721Tokens] = useState<string[]>(admin.walletPerms.erc721Tokens);
  const [permBurn, setPermBurn] = useState(admin.walletPerms.burnVdt);
  const [burnTokens, setBurnTokens] = useState<string[]>(admin.walletPerms.burnVdtTokens);
  const [permSign, setPermSign] = useState(admin.walletPerms.signing);

  const hasProductTransfers = selectedRoles.has('product_transfers');
  const hasPactveraRoles = selectedRoles.has('pactvera_admin') || selectedRoles.has('pactvera_signer') || selectedRoles.has('tca_release');

  useEffect(() => {
    // Reset permissions that are controlled by roles if they are not enabled by any current role
    const hasOrgAdmin = selectedRoles.has('org_admin');
    const hasProductTransfers = selectedRoles.has('product_transfers');
    const hasPactveraRoles = selectedRoles.has('pactvera_admin') || selectedRoles.has('pactvera_signer') || selectedRoles.has('tca_release');

    if (hasOrgAdmin) {
      setPermErc20(true);
      setPermErc721(true);
      setPermBurn(true);
      setPermSign(true);
      if (!erc721Tokens.includes('Product VDT')) setErc721Tokens(prev => [...prev, 'Product VDT']);
      if (!burnTokens.includes('Pactvera VDT')) setBurnTokens(prev => [...prev, 'Pactvera VDT']);
    } else {
      // Logic for granular roles
      setPermErc721(hasProductTransfers);
      if (hasProductTransfers) {
        if (!erc721Tokens.includes('Product VDT')) setErc721Tokens(prev => [...prev, 'Product VDT']);
      } else {
        setErc721Tokens([]);
      }

      setPermSign(hasPactveraRoles);
      setPermBurn(hasPactveraRoles);
      if (hasPactveraRoles) {
        if (!burnTokens.includes('Pactvera VDT')) setBurnTokens(prev => [...prev, 'Pactvera VDT']);
      } else {
        setBurnTokens([]);
      }

      // If neither high role is selected, ERC20 should be false
      if (!hasOrgAdmin) {
        setPermErc20(false);
      }
    }
  }, [selectedRoles]);

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

  const handleSave = () => {
    const walletPermissions = {
      erc20: permErc20,
      erc20Amount,
      erc721: permErc721,
      erc721Tokens,
      burnVdt: permBurn,
      burnVdtTokens: burnTokens,
      signing: permSign
    };

    onSave(Array.from(selectedRoles), walletPermissions);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-roles-modal">
        <div className="modal-header">
          <div className="modal-title">Edit Roles & Permissions</div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
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

          <div className="form-group mt-24">
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
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
