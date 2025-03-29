import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/auth';
import Toast from '../components/Toast';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
  description?: string;
  createdAt?: string;
  lastLogin?: string;
  deletedAt?: string;
  pairs?: string[];
}

interface UserResponse {
  result: User[];
  total: number;
  page: number;
  limit: number;
  message: string;
  status: number;
}

interface QueryParams {
  name?: string;
  email?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    description: user.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(`/admin/users/${user.id}`, {
        name: formData.name,
        description: formData.description
      });
      
      // Cập nhật lại thông tin user với dữ liệu mới từ server
      const updatedUser: User = {
        ...user,
        name: formData.name,
        description: formData.description
      };
      
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user. Please try again later.");
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '20px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        border: '1px solid #f0b90b'
      }}>
        <h3 style={{ color: '#f0b90b', marginBottom: '20px' }}>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #f0b90b',
                background: 'transparent',
                color: 'white'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #666',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#999',
                cursor: 'not-allowed'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #f0b90b',
                background: 'transparent',
                color: 'white'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                background: '#f0b90b',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // Tạo biến dùng chung cho limit
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: 'name',
    sortOrder: 'ASC'
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  });

  const fetchUsers = async () => {
    try {
      // Kiểm tra role của user hiện tại
      const userResponse = await axiosInstance.get('/user/me');
      const currentUserData = userResponse.data.result;
      setCurrentUser(currentUserData);

      // Nếu không phải admin, chuyển hướng về trang chủ
      if (currentUserData.role !== 'admin') {
        window.location.href = '/';
        return;
      }

      // Fetch danh sách users với query params
      const response = await axiosInstance.get<UserResponse>('/admin/users', { params: queryParams });
      setUsers(response.data.result);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [queryParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQueryParams(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset về trang 1 khi tìm kiếm
    }));
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setQueryParams(prev => ({
      ...prev,
      role: value || undefined,
      page: 1 // Reset về trang 1 khi lọc
    }));
  };

  const handleSort = (sortBy: string) => {
    setQueryParams(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      page
    }));
    setCurrentPage(page);
  };

  const handleEditUser = (user: User) => {
    console.log("User to edit:", user);
    setEditingUser(user);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setEditingUser(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Cập nhật lại state editingUser với thông tin mới
      setEditingUser(updatedUser);
      
      // Cập nhật lại danh sách users
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));

      // Hiển thị thông báo thành công
      setToast({
        show: true,
        message: 'User updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error("Failed to update user", error);
      setToast({
        show: true,
        message: 'Failed to update user. Please try again later.',
        type: 'error'
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}`, { role: newRole });
      
      // Cập nhật lại state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setToast({
        show: true,
        message: 'User role updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error("Failed to update user role", error);
      setToast({
        show: true,
        message: 'Failed to update user role. Please try again later.',
        type: 'error'
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`);
      
      // Cập nhật lại state
      setUsers(users.filter(user => user.id !== userId));
      
      setToast({
        show: true,
        message: response.data.message || 'User deleted successfully!',
        type: 'success'
      });
    } catch (error: any) {
      console.error("Failed to delete user", error);
      setToast({
        show: true,
        message: error.response?.data?.message || 'Failed to delete user. Please try again later.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container">
        <div className="error">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  return (
    <div className="container">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <div className="user-profile">
        <div className="profile-header">
          <h2>👥 User Management</h2>
        </div>
        
        <div className="profile-info">
          <div className="info-section">
            <h3>📊 User Statistics</h3>
            <p>Total Users: {total}</p>
            <p>Admin Users: {users.filter(user => user.role === 'admin').length}</p>
            <p>Regular Users: {users.filter(user => user.role === 'user').length}</p>
          </div>

          <div className="info-section">
            <div className="search-filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                name="name"
                placeholder="Search by name"
                value={queryParams.name || ''}
                onChange={handleSearch}
                style={{
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #f0b90b',
                  background: 'transparent',
                  color: 'white'
                }}
              />
              <input
                type="text"
                name="email"
                placeholder="Search by email"
                value={queryParams.email || ''}
                onChange={handleSearch}
                style={{
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #f0b90b',
                  background: 'transparent',
                  color: 'white'
                }}
              />
              <select
                value={queryParams.role || ''}
                onChange={handleRoleFilter}
                style={{
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #f0b90b',
                  background: 'transparent',
                  color: 'white'
                }}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="users-table-container">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      User {queryParams.sortBy === 'name' && (queryParams.sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                      Email {queryParams.sortBy === 'email' && (queryParams.sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                      Role {queryParams.sortBy === 'role' && (queryParams.sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th>Pairs</th>
                    <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                      Joined {queryParams.sortBy === 'createdAt' && (queryParams.sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('lastLogin')} style={{ cursor: 'pointer' }}>
                      Last Login {queryParams.sortBy === 'lastLogin' && (queryParams.sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                          />
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          style={{
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid #f0b90b',
                            padding: '5px',
                            borderRadius: '5px'
                          }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '4px',
                          maxWidth: '200px',
                          overflow: 'auto',
                          maxHeight: '100px'
                        }}>
                          {user.pairs?.map(pair => (
                            <span 
                              key={pair}
                              style={{
                                background: 'rgba(240, 185, 11, 0.2)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              {pair.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</td>
                      <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => handleEditUser(user)}
                            style={{
                              background: '#f0b90b',
                              color: 'black',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser?.id}
                            style={{
                              background: user.id === currentUser?.id ? '#666' : '#e74c3c',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              cursor: user.id === currentUser?.id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '10px', 
              marginTop: '20px' 
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  background: currentPage === 1 ? '#666' : '#f0b90b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ padding: '8px 16px', color: 'white' }}>
                Page {currentPage} of {Math.ceil(total / ITEMS_PER_PAGE)}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(total / ITEMS_PER_PAGE)}
                style={{
                  padding: '8px 16px',
                  background: currentPage >= Math.ceil(total / ITEMS_PER_PAGE) ? '#666' : '#f0b90b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage >= Math.ceil(total / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleCloseModal}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default ManageUsers; 