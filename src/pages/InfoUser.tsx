import React, { useEffect, useState } from 'react';
import axiosInstance, { handleLogout } from '../services/auth';

interface UserInfo {
  name: string;
  picture: string;
  email: string;
  selectedPairs: string[];
  createdAt: string;
  lastLogin: string | null;
  totalPairs: number;
  role: string;
  description: string | null;
}

const InfoUser: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch user details from API
        const response = await axiosInstance.get('/user/me');
        const userData = response.data.result; // Access the result object

        // Get selected pairs from localStorage
        const storedPairs = localStorage.getItem("selectedPairs");
        const pairs = storedPairs ? JSON.parse(storedPairs) : [];
        
        setUserInfo({
          name: userData.name,
          picture: userData.picture,
          email: userData.email,
          selectedPairs: pairs,
          createdAt: new Date(userData.createdAt).toLocaleDateString(),
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Never',
          totalPairs: pairs.length,
          role: userData.role,
          description: userData.description
        });
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setError("Failed to load user information. Please try again later.");
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

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

  if (!userInfo) {
    return (
      <div className="container">
        <div className="error">Please log in to view your information</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="user-profile">
        <div className="profile-header">
          <img src={userInfo.picture} alt="User" className="profile-avatar" />
          <h2>Welcome, {userInfo.name}!</h2>
        </div>
        
        <div className="profile-info">
          <div className="info-section">
            <h3>📧 Contact Information</h3>
            <p>Email: {userInfo.email}</p>
            <p>Role: {userInfo.role}</p>
            <p>Member since: {userInfo.createdAt}</p>
            <p>Last login: {userInfo.lastLogin}</p>
            {userInfo.description && (
              <p>Description: {userInfo.description}</p>
            )}
          </div>

          <div className="info-section">
            <h3>📊 Trading Statistics</h3>
            <p>Total selected pairs: {userInfo.totalPairs}</p>
          </div>

          <div className="info-section">
            <h3>🎯 Selected Trading Pairs</h3>
            {userInfo.selectedPairs.length > 0 ? (
              <ul className="pairs-list">
                {userInfo.selectedPairs.map((pair) => (
                  <li key={pair}>{pair.toUpperCase()}</li>
                ))}
              </ul>
            ) : (
              <p>No trading pairs selected yet</p>
            )}
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

export default InfoUser; 