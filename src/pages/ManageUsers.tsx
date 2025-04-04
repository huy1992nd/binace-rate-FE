import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/auth';
import Toast from '../components/Toast';
import styles from './style.module.css';

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
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles['modal-form-group']}>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles['modal-input']}
            />
          </div>
          <div className={styles['modal-form-group']}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className={styles['modal-input']}
            />
          </div>
          <div className={styles['modal-form-group']}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={styles['modal-input']}
            />
          </div>
          <div className={styles['modal-buttons']}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles['modal-button']} ${styles['cancel']}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles['modal-button']} ${styles['save']}`}
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
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const ITEMS_PER_PAGE = 5;
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

  // Thêm CSS cho responsive
  useEffect(() => {
    const styles = `
      @media screen and (max-width: 768px) {
        .user-profile {
          padding: 1rem;
          margin: 1rem;
          width: 95%;
          max-width: 100%;
        }

        .info-section {
          padding: 1rem;
          width: 94%;
          overflow-x: hidden;
        }

        .search-filters {
          flex-direction: column;
          width: 80%;
        }

        .search-filters input,
        .search-filters select {
          width: 96%;
        }

        .users-table-container {
          margin: 0;
          padding: 0;
        }

        table {
          font-size: 14px;
        }

        th, td {
          padding: 8px;
        }

        .profile-info {
          gap: 1rem;
        }
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const toggleStats = () => {
    setIsStatsExpanded(!isStatsExpanded);
  };

  // Thêm các class mới vào CSS
  const tableColumnStyles = {
    user: 'col-user',
    email: 'col-email',
    role: 'col-role',
    pairs: 'col-pairs',
    lastLogin: 'col-last-login',
    actions: 'col-actions'
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
    <div className={styles.container}>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <div className={styles.userProfile}>
        <div className={styles.profileHeader}>
          <h2>👥 User Management</h2>
        </div>
        
        <div className={styles.profileInfo}>
          <div className={`${styles.infoSection} ${isStatsExpanded ? styles.expanded : styles.collapsed}`} onClick={toggleStats}>
            <div className={styles.infoSectionHeader}>
              <h3>
                <span>📊</span>
                User Statistics
              </h3>
              <span className={`${styles.toggleIcon} ${isStatsExpanded ? styles.expanded : ''}`}>
                {isStatsExpanded ? '▼' : '▶'}
              </span>
            </div>
            <div className={styles.infoSectionContent}>
              <p>
                <span>👥</span>
                Total Users: {total}
              </p>
              <p>
                <span>👑</span>
                Admin Users: {users.filter(user => user.role === 'admin').length}
              </p>
              <p>
                <span>👤</span>
                Regular Users: {users.filter(user => user.role === 'user').length}
              </p>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.searchFilters}>
              <input
                type="text"
                name="name"
                placeholder="Search by name"
                value={queryParams.name || ''}
                onChange={handleSearch}
              />
              <input
                type="text"
                name="email"
                placeholder="Search by email"
                value={queryParams.email || ''}
                onChange={handleSearch}
              />
              <select
                value={queryParams.role || ''}
                onChange={handleRoleFilter}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className={styles.usersTableContainer}>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th className={tableColumnStyles.user}>User</th>
                    <th className={tableColumnStyles.email}>Email</th>
                    <th className={tableColumnStyles.role}>Role</th>
                    <th className={tableColumnStyles.pairs}>Pairs</th>
                    <th className={tableColumnStyles.lastLogin}>Last Login</th>
                    <th className={tableColumnStyles.actions}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userInfo}>
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            className={styles.userAvatar}
                          />
                          {user.name}
                        </div>
                      </td>
                      <td>
                        <div className={styles.emailCell}>
                          <span title={user.email}>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className={styles.roleSelect}
                          disabled={user.id === currentUser?.id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <div className={styles.pairsContainer}>
                          {user.pairs?.map(pair => (
                            <span 
                              key={pair}
                              className={styles.pairTag}
                            >
                              {pair.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }) : 'Never'}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={styles.actionButton + ' ' + styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser?.id}
                            className={styles.actionButton + ' ' + styles.deleteButton}
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

            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {currentPage} of {Math.ceil(total / ITEMS_PER_PAGE)}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(total / ITEMS_PER_PAGE)}
                className={styles.paginationButton}
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