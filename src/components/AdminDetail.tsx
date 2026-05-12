import React from 'react';
import './AdminDetail.css';
import { ArrowLeft, Plus, Trash2, Shield, Wallet, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditRolesModal } from './EditRolesModal';

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

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
      } else if (['pactvera_admin', 'pactvera_signer', 'tca_release', 'org_admin'].includes(deleteModal.id)) {
        // Only remove signing/burning if ALL pactvera-related roles AND org_admin are gone
        const hasOtherHighRole = updatedRoles.some(r => ['pactvera_admin', 'pactvera_signer', 'tca_release', 'org_admin'].includes(r));
        if (!hasOtherHighRole) {
          updatedPerms.signing = false;
          updatedPerms.burnVdt = false;
          updatedPerms.burnVdtTokens = [];
        }

        // If org_admin is removed, check if other roles still need erc20/erc721
        if (deleteModal.id === 'org_admin') {
          const hasProductTransfers = updatedRoles.includes('product_transfers');
          if (!hasProductTransfers) {
            updatedPerms.erc20 = false;
            updatedPerms.erc721 = false;
            updatedPerms.erc721Tokens = [];
          }
        }
      }
    } else if (deleteModal.type === 'permission') {
      const permKey = deleteModal.id as keyof typeof updatedPerms;
      if (permKey === 'erc20') {
        updatedPerms.erc20 = false;
      } else if (permKey === 'erc721') {
        updatedPerms.erc721 = false;
        updatedPerms.erc721Tokens = [];
      } else if (permKey === 'signing') {
        updatedPerms.signing = false;
      } else if (permKey === 'burnVdt') {
        updatedPerms.burnVdt = false;
        updatedPerms.burnVdtTokens = [];
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
      extraWarning = " This will also remove associated ERC721 wallet permissions.";
    } else if (['pactvera_admin', 'pactvera_signer', 'tca_release', 'org_admin'].includes(roleId)) {
      const highRoles = ['pactvera_admin', 'pactvera_signer', 'tca_release', 'org_admin'];
      const otherHighRoles = highRoles.filter(r => r !== roleId);
      const hasOtherRole = admin?.roles.some(r => otherHighRoles.includes(r));
      if (!hasOtherRole) {
        extraWarning = roleId === 'org_admin' 
          ? " This will also remove ALL wallet permissions assigned to this administrator."
          : " This will also remove Pactvera Signing and VDT Burn wallet permissions.";
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
    setDeleteModal({
      isOpen: true,
      type: 'permission',
      id: permKey,
      name: label,
      warning: " This will revoke this specific wallet authority from the administrator."
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

  const handleSaveRoles = (updatedRoles: string[], updatedPerms: any) => {
    if (!admin) return;
    updateAdmin({ ...admin, roles: updatedRoles, walletPerms: updatedPerms });
    setIsEditModalOpen(false);
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
          <button className="btn-add-role" onClick={() => setIsEditModalOpen(true)}>
            <span>Update</span>
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
              <th style={{ width: '20%' }}>Roles</th>
              <th style={{ width: '40%' }}>Description</th>
              <th style={{ width: '30%' }}>Wallet Permissions</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admin.roles.length > 0 ? (
              admin.roles.map(roleId => {
                const info = getRoleInfo(roleId);
                
                // Get permissions associated with this role
                const associatedPerms: React.ReactNode[] = [];
                
                if (roleId === 'product_transfers') {
                  if (admin.walletPerms.erc721) {
                    associatedPerms.push(
                      <div key="erc721" className="perm-tag">
                        ERC721: {admin.walletPerms.erc721Tokens.join(', ')}
                      </div>
                    );
                  }
                } else if (roleId === 'pactvera_admin' || roleId === 'pactvera_signer' || roleId === 'tca_release') {
                  if (admin.walletPerms.signing) {
                    associatedPerms.push(
                      <div key="signing" className="perm-tag">Pactvera Signing</div>
                    );
                  }
                  if (admin.walletPerms.burnVdt) {
                    associatedPerms.push(
                      <div key="burn" className="perm-tag">
                        Burn VDT: {admin.walletPerms.burnVdtTokens.join(', ')}
                      </div>
                    );
                  }
                } else if (roleId === 'org_admin') {
                  if (admin.walletPerms.erc20) associatedPerms.push(<div key="erc20" className="perm-tag">ERC20 Transfer</div>);
                  if (admin.walletPerms.erc721) associatedPerms.push(<div key="erc721" className="perm-tag">ERC721 Transfer</div>);
                  if (admin.walletPerms.signing) associatedPerms.push(<div key="signing" className="perm-tag">Pactvera Signing</div>);
                  if (admin.walletPerms.burnVdt) associatedPerms.push(<div key="burn" className="perm-tag">Burn Authority</div>);
                }

                return (
                  <tr key={roleId}>
                    <td className="role-name-cell">{info.label}</td>
                    <td className="role-desc-cell">{info.desc}</td>
                    <td className="role-perms-cell">
                      {associatedPerms.length > 0 ? (
                        <div className="perms-list">
                          {associatedPerms}
                        </div>
                      ) : (
                        <span className="no-perms">-</span>
                      )}
                    </td>
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
                <td colSpan={4} className="empty-state">No roles assigned</td>
              </tr>
            )}
            
            {/* Handle orphan permissions if any (e.g. ERC20 without Product Transfers) */}
            {(() => {
              const orphans: React.ReactNode[] = [];
              
              // Check if permissions are being shown in any role row
              const hasOrgAdmin = admin.roles.includes('org_admin');
              const hasPactveraGroup = admin.roles.some(r => ['pactvera_admin', 'pactvera_signer', 'tca_release'].includes(r));
              const hasProductTransfers = admin.roles.includes('product_transfers');

              // ERC20 is only shown in Org Admin row
              if (!hasOrgAdmin && admin.walletPerms.erc20) {
                orphans.push(
                  <div key="o-erc20" className="perm-tag with-action">
                    <span>ERC20 Transfer ({admin.walletPerms.erc20Amount})</span>
                    <button className="tag-delete-btn" onClick={() => triggerPermissionDelete('erc20', 'ERC20 Transfer')}>
                      <X size={12} />
                    </button>
                  </div>
                );
              }

              // ERC721 is shown in Product Transfers and Org Admin rows
              if (!hasOrgAdmin && !hasProductTransfers && admin.walletPerms.erc721) {
                orphans.push(
                  <div key="o-erc721" className="perm-tag with-action">
                    <span>ERC721: {admin.walletPerms.erc721Tokens.join(', ')}</span>
                    <button className="tag-delete-btn" onClick={() => triggerPermissionDelete('erc721', 'ERC721 Transfer')}>
                      <X size={12} />
                    </button>
                  </div>
                );
              }

              // Signing is shown in Pactvera group and Org Admin rows
              if (!hasOrgAdmin && !hasPactveraGroup && admin.walletPerms.signing) {
                orphans.push(
                  <div key="o-sign" className="perm-tag with-action">
                    <span>Pactvera Signing</span>
                    <button className="tag-delete-btn" onClick={() => triggerPermissionDelete('signing', 'Pactvera Signing')}>
                      <X size={12} />
                    </button>
                  </div>
                );
              }

              // Burn is shown in Pactvera group and Org Admin rows
              if (!hasOrgAdmin && !hasPactveraGroup && admin.walletPerms.burnVdt) {
                orphans.push(
                  <div key="o-burn" className="perm-tag with-action">
                    <span>Burn Authority: {admin.walletPerms.burnVdtTokens.join(', ')}</span>
                    <button className="tag-delete-btn" onClick={() => triggerPermissionDelete('burnVdt', 'Burn Authority')}>
                      <X size={12} />
                    </button>
                  </div>
                );
              }
              
              if (orphans.length > 0) {
                return (
                  <tr className="orphan-perms-row">
                    <td className="role-name-cell">General Access</td>
                    <td className="role-desc-cell">Standalone wallet permissions not tied to a specific administrative role.</td>
                    <td className="role-perms-cell">
                      <div className="perms-list">{orphans}</div>
                    </td>
                    <td className="actions-cell">
                      {/* Standalone perms don't have a single role to delete, maybe disable or handle differently */}
                    </td>
                  </tr>
                );
              }
              return null;
            })()}
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
      <EditRolesModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        admin={admin}
        onSave={handleSaveRoles}
      />
    </div>
  );
};
