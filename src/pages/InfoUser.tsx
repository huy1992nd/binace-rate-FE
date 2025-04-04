import React, { useState, useEffect } from 'react';
import axiosInstance, { handleLogout } from '../services/auth';
import styles from './style.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface UserInfo {
  name: string;
  email: string;
  picture: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  description?: string;
  totalPairs: number;
  selectedPairs: string[];
}

const InfoUser: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Lấy danh sách cặp tiền tệ từ Redux store
  const selectedPairs = useSelector((state: RootState) => state.selectedPairs.pairs);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/user/me');
        const userData = response.data.result;
        
        setUserInfo({
          name: userData.name,
          picture: userData.picture,
          email: userData.email,
          selectedPairs: selectedPairs, // Sử dụng selectedPairs từ Redux
          createdAt: new Date(userData.createdAt).toLocaleDateString(),
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Never',
          totalPairs: selectedPairs.length, // Cập nhật số lượng cặp tiền tệ
          role: userData.role,
          description: userData.description
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [selectedPairs]); // Thêm selectedPairs vào dependencies để cập nhật khi có thay đổi

  if (loading || !userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.userProfile}>
        <div className={styles.profileHeader}>
          <img src={userInfo.picture} alt="User" className={styles.profileAvatar} />
          <h2>Welcome, {userInfo.name}!</h2>
        </div>
        
        <div className={styles.profileInfo}>
          <div className={styles.infoSection}>
            <h3>📧 Contact Information</h3>
            <p>Email: {userInfo.email}</p>
            <p>Role: {userInfo.role}</p>
            <p>Member since: {userInfo.createdAt}</p>
            <p>Last login: {userInfo.lastLogin}</p>
            {userInfo.description && (
              <p>Description: {userInfo.description}</p>
            )}
          </div>

          <div className={styles.infoSection}>
            <h3>📊 Trading Statistics</h3>
            <p>Total selected pairs: {userInfo.totalPairs}</p>
          </div>

          <div className={styles.infoSection}>
            <h3>🎯 Selected Trading Pairs</h3>
            {userInfo.selectedPairs.length > 0 ? (
              <ul className={styles.pairsList}>
                {userInfo.selectedPairs.map((pair) => (
                  <li key={pair}>{pair.toUpperCase()}</li>
                ))}
              </ul>
            ) : (
              <p>No trading pairs selected yet</p>
            )}
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

export default InfoUser; 