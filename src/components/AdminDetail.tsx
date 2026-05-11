import React from 'react';
import './AdminDetail.css';
import { ArrowLeft, Plus, Trash2, Shield, Wallet } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const AdminDetail: React.FC = () => {
  const { 
    selectedAdminId, 
    admins, 
    setWebView, 
    updateAdmin,
    removeAdmin 
  } = useAppContext();

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    type: 'role' | 'permission' | 'admin';
    id: string;
    name: string;
    warning?: string;
  }>({
    isOpen: false,
    type: 'role',
    id: '',
    name: '',
    warning: ''
  });

  const admin = admins.find(a => a.id === selectedAdminId);

  if (!admin) {
    return (
      <div className="admin-detail-error">
        <p>Admin not found</p>
        <button onClick={() => setWebView('USER_MANAGEMENT')}>Back to List</button>
      </div>
    );
  }

  const getRoleInfo = (roleId: string) => {
    const roleMap: Record<string, { label: string, desc: string }> = {
      'product_transfers': { 
        label: 'Product Transfers', 
        desc: 'Authorizes and manages the transfer of physical and digital products.' 
      },
      'pactvera_admin': { 
        label: 'Pactvera Admin', 
        desc: 'Manages access and organization of agreements and templates, but cannot send or sign Pactveras.' 
      },
      'pactvera_signer': { 
        label: 'Pactvera Signer', 
        desc: 'Reviews and signs Pactveras on behalf of the organization with legal authority.' 
      },
      'tca_release': { 
        label: 'TCA Releaser', 
        desc: 'Authorizes the release of funds or assets (TCAs) tied to a Pactvera agreement on behalf of the organization.' 
      },
      'kyb_verifier': { 
        label: 'KYB Verifier', 
        desc: 'Verifies business identity and compliance documentation for onboarding.' 
      },
      'org_admin': { 
        label: 'Org Admin', 
        desc: 'Full administrative access to organization settings and user management.' 
      },
      'pactvera_sender': {
        label: 'Pactvera Sender',
        desc: 'Creates and sends Pactveras within approved folders, without signing or releasing value. Creates and uses templates as needed.'
      },
      'president': {
        label: 'President',
        desc: 'Executive oversight and final authority on all organizational operations.'
      }
    };
    return roleMap[roleId] || { label: roleId, desc: '-' };
  };

  const handleConfirmDelete = () => {
    if (!admin) return;

    let updatedRoles = [...admin.roles];
    let updatedPerms = { ...admin.walletPerms };

    if (deleteModal.type === 'role') {
      updatedRoles = updatedRoles.filter(r => r !== deleteModal.id);
      
      // Handle associated permissions
      if (deleteModal.id === 'product_transfers') {
        updatedPerms.erc721 = false;
        updatedPerms.erc721Tokens = [];
      } else if (deleteModal.id === 'pactvera_admin' || deleteModal.id === 'pactvera_signer') {
        // Only remove signing if BOTH pactvera roles are gone
        const hasOtherPactveraRole = updatedRoles.some(r => r === 'pactvera_admin' || r === 'pactvera_signer');
        if (!hasOtherPactveraRole) {
          updatedPerms.signing = false;
        }
      }
    } else if (deleteModal.type === 'permission') {
      const permKey = deleteModal.id as keyof typeof admin.walletPerms;
      if (typeof updatedPerms[permKey] === 'boolean') {
        (updatedPerms[permKey] as any) = false;
      } else if (Array.isArray(updatedPerms[permKey])) {
        (updatedPerms[permKey] as any) = [];
      } else {
        (updatedPerms[permKey] as any) = '';
      }

      // Handle associated roles
      if (deleteModal.id === 'erc721') {
        updatedRoles = updatedRoles.filter(r => r !== 'product_transfers');
      } else if (deleteModal.id === 'signing') {
        updatedRoles = updatedRoles.filter(r => r !== 'pactvera_admin' && r !== 'pactvera_signer');
      }
    } else if (deleteModal.type === 'admin') {
      removeAdmin(admin.id);
      setDeleteModal({ ...deleteModal, isOpen: false });
      return;
    }

    updateAdmin({ ...admin, roles: updatedRoles, walletPerms: updatedPerms });
    setDeleteModal({ ...deleteModal, isOpen: false });
  };

  const triggerRoleDelete = (roleId: string) => {
    const info = getRoleInfo(roleId);
    let extraWarning = "";
    
    if (roleId === 'product_transfers') {
      extraWarning = " This will also remove the 'ERC721 Minting' wallet permission.";
    } else if (roleId === 'pactvera_admin' || roleId === 'pactvera_signer') {
      const otherRole = roleId === 'pactvera_admin' ? 'pactvera_signer' : 'pactvera_admin';
      if (!admin?.roles.includes(otherRole)) {
        extraWarning = " This will also remove the 'Pactvera Signing' wallet permission.";
      }
    }

    setDeleteModal({
      isOpen: true,
      type: 'role',
      id: roleId,
      name: info.label,
      warning: extraWarning
    });
  };

  const triggerPermissionDelete = (permKey: string, label: string) => {
    let extraWarning = "";
    if (permKey === 'erc721') {
      extraWarning = " This will also remove the 'Product Transfers' role.";
    } else if (permKey === 'signing') {
      extraWarning = " This will also remove the 'Pactvera Admin' and 'Pactvera Signer' roles.";
    }

    setDeleteModal({
      isOpen: true,
      type: 'permission',
      id: permKey,
      name: label,
      warning: extraWarning
    });
  };

  const triggerAdminDelete = () => {
    setDeleteModal({
      isOpen: true,
      type: 'admin',
      id: admin?.id || '',
      name: admin?.name || ''
    });
  };

  return (
    <div className="admin-detail-container">
      <div className="detail-breadcrumb">
        <span onClick={() => setWebView('USER_MANAGEMENT')} className="breadcrumb-link">Administration</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span onClick={() => setWebView('USER_MANAGEMENT')} className="breadcrumb-link">User Management</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span className="breadcrumb-active">Details</span>
      </div>

      <div className="detail-header">
        <button className="back-btn" onClick={() => setWebView('USER_MANAGEMENT')}>
          <ArrowLeft size={18} />
          <span>Details</span>
        </button>
      </div>

      <div className="general-info-card">
        <div className="info-profile">
          <div className="profile-image">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=f0f4f8&color=2e7d32`} alt={admin.name} />
          </div>
          <div className="info-content">
            <h3>General Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{admin.name.toUpperCase()}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{admin.email}</p>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <p>{admin.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">
          <Shield size={20} className="section-icon" />
          <h2>User Roles</h2>
        </div>
        <div className="section-actions">
          <button className="btn-add-role">
            <Plus size={16} />
            <span>Add Role</span>
          </button>
          <button className="btn-remove-user" onClick={triggerAdminDelete}>
            <Trash2 size={16} />
            <span>Remove User</span>
          </button>
        </div>
      </div>

      <div className="detail-table-container">
        <table className="detail-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Roles</th>
              <th style={{ width: '65%' }}>Description</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admin.roles.length > 0 ? (
              admin.roles.map(roleId => {
                const info = getRoleInfo(roleId);
                return (
                  <tr key={roleId}>
                    <td className="role-name-cell">{info.label}</td>
                    <td className="role-desc-cell">{info.desc}</td>
                    <td className="actions-cell">
                      <button className="action-dots-btn" onClick={() => triggerRoleDelete(roleId)}>
                        <Trash2 size={16} color="#ef5350" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="empty-state">No roles assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section-header mt-32">
        <div className="section-title">
          <Wallet size={20} className="section-icon" />
          <h2>Wallet Permissions</h2>
        </div>
      </div>

      <div className="detail-table-container">
        <table className="detail-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Permission</th>
              <th style={{ width: '65%' }}>Value/Scope</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admin.walletPerms.erc20 && (
              <tr>
                <td className="role-name-cell">ERC20 Transfer</td>
                <td className="role-desc-cell">Allowed up to {admin.walletPerms.erc20Amount} units</td>
                <td className="actions-cell">
                  <button className="action-dots-btn" onClick={() => triggerPermissionDelete('erc20', 'ERC20 Transfer')}>
                    <Trash2 size={16} color="#ef5350" />
                  </button>
                </td>
              </tr>
            )}
            {admin.walletPerms.erc721 && admin.walletPerms.erc721Tokens.length > 0 && (
              <tr>
                <td className="role-name-cell">ERC721 Minting</td>
                <td className="role-desc-cell">Authorized for: {admin.walletPerms.erc721Tokens.join(', ')}</td>
                <td className="actions-cell">
                  <button className="action-dots-btn" onClick={() => triggerPermissionDelete('erc721', 'ERC721 Minting')}>
                    <Trash2 size={16} color="#ef5350" />
                  </button>
                </td>
              </tr>
            )}
            {admin.walletPerms.burnVdt && admin.walletPerms.burnVdtTokens.length > 0 && (
              <tr>
                <td className="role-name-cell">VDT Burn Authority</td>
                <td className="role-desc-cell">Authorized for: {admin.walletPerms.burnVdtTokens.join(', ')}</td>
                <td className="actions-cell">
                  <button className="action-dots-btn" onClick={() => triggerPermissionDelete('burnVdt', 'VDT Burn Authority')}>
                    <Trash2 size={16} color="#ef5350" />
                  </button>
                </td>
              </tr>
            )}
            {admin.walletPerms.signing && (
              <tr>
                <td className="role-name-cell">Pactvera Signing</td>
                <td className="role-desc-cell">Full authority to sign and execute Pactvera agreements</td>
                <td className="actions-cell">
                  <button className="action-dots-btn" onClick={() => triggerPermissionDelete('signing', 'Pactvera Signing')}>
                    <Trash2 size={16} color="#ef5350" />
                  </button>
                </td>
              </tr>
            )}
            {!admin.walletPerms.erc20 && !admin.walletPerms.erc721 && !admin.walletPerms.burnVdt && !admin.walletPerms.signing && (
              <tr>
                <td colSpan={3} className="empty-state">No wallet permissions granted</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete the"
        itemName={`${deleteModal.name} ${deleteModal.type.charAt(0).toUpperCase() + deleteModal.type.slice(1)}`}
        warning={deleteModal.warning}
      />
    </div>
  );
};
