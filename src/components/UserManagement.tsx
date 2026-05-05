import React from 'react';
import './UserManagement.css';
import { Search, List, Grid, Users, Plus, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const UserManagement: React.FC = () => {
  const { setIsInviteModalOpen, admins } = useAppContext();

  const pendingCount = admins.filter(a => a.status === 'Pending').length;

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
    <div className="user-management">
      <div className="um-header">
        <h1 className="um-title">User Management</h1>
        
        <div className="um-actions">
          <div className="search-box">
            <Search size={16} color="#aaa" />
            <input type="text" className="search-input" placeholder="Search" />
          </div>
          
          <div className="icon-group">
            <button className="icon-btn active"><List size={16} /></button>
            <button className="icon-btn"><Grid size={16} /></button>
          </div>
          
          <button className="btn-secondary">
            <Users size={16} />
            View Pending Invites ({pendingCount})
          </button>
          
          <button className="btn-primary" onClick={() => setIsInviteModalOpen(true)}>
            <Plus size={16} />
            Invite Admin
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID ↑↓</th>
              <th>Full Name ↑↓</th>
              <th>Email ↑↓</th>
              <th>Date Added</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.dateAdded}</td>
                <td>
                  <div className="role-chip-group">
                    {admin.roles.slice(0, 2).map(r => (
                      <span key={r} className="status-badge light-orange">{getRoleLabel(r)}</span>
                    ))}
                    {admin.roles.length > 2 && <span className="status-badge light-orange">+{admin.roles.length - 2}</span>}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${admin.status === 'Active' ? 'green' : 'orange'}`}>
                    {admin.status}
                  </span>
                </td>
                <td><MoreVertical size={16} color="#aaa" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="table-footer">
          <div>Showing 1 to {admins.length} of {admins.length} results</div>
          <div className="pagination">
            <button className="page-btn">«</button>
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">›</button>
            <button className="page-btn">»</button>
          </div>
        </div>
      </div>
    </div>
  );
};
