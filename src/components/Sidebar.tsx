import React, { useEffect, useState } from "react";
import axiosInstance, { handleLogout } from '../services/auth';
import "../App.css";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Toast from './Toast';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setSelectedPairs, addPair, removePair, clearPairs } from '../store/selectedPairsSlice';

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

interface User {
  name: string;
  email: string;
  picture: string;
  role: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  const [user, setUser] = useState<User | null>(null);
  const [topPairs, setTopPairs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  });

  const dispatch = useDispatch();
  const selectedPairs = useSelector((state: RootState) => state.selectedPairs.pairs);

  const fetchTopPairs = async () => {
    try {
      const response = await axiosInstance.get('/crypto/top-pairs');
      console.log("response", response);
      setTopPairs(response.data?.result || []);
    } catch (error) {
      console.error("Failed to fetch top pairs", error);
      handleLogout();
    }
  };

  const fetchSavedPairs = async (token: string) => {
    try {
      const response = await axiosInstance.get('/crypto/get-pairs');
      const savedPairs = response.data;
      dispatch(setSelectedPairs(savedPairs));
      localStorage.setItem("selectedPairs", JSON.stringify(savedPairs));
    } catch (error) {
      console.error("Failed to fetch saved pairs", error);
      handleLogout();
    }
  };

  // Handle user data and initial pairs fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.get("/user/me");
        setUser(response.data.result);
        // Fetch pairs after getting user data
        await fetchTopPairs();
        await fetchSavedPairs(token);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  // Save pairs to backend when selectedPairs changes
  useEffect(() => {
    if (user && selectedPairs.length > 0) {
      savePairsToBackend(selectedPairs);
    }
  }, [selectedPairs, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedPairs");
    localStorage.removeItem("activeTab");
    dispatch(clearPairs());
    window.location.reload();
  };

  const savePairsToBackend = async (updatedPairs: string[]) => {
    if (!user) return;
    
    try {
      await axiosInstance.post('/crypto/save-pairs', { pairs: updatedPairs });
    } catch (error) {
      console.error("Failed to save selected pairs", error);
      handleLogout();
    }
  };

  const handlePairSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
  
    setIsUpdating(true);
    const value = event.target.value;
    const isChecked = event.target.checked;
  
    if (isChecked) {
      dispatch(addPair(value));
    } else {
      dispatch(removePair(value));
    }
  
    localStorage.setItem("selectedPairs", JSON.stringify(selectedPairs));
    window.dispatchEvent(new Event("storage"));
  
    setTimeout(() => setIsUpdating(false), 200);
  };

  const handleResetPairs = () => {
    dispatch(clearPairs());
    localStorage.removeItem("selectedPairs");
    window.dispatchEvent(new Event("storage"));
  };

  const handleDropdownToggle = () => {
    if (showDropdown) {
      setIsClosing(true);
      setTimeout(() => {
        setShowDropdown(false);
        setIsClosing(false);
      }, 300);
    } else {
      setShowDropdown(true);
    }
  };

  const handleLoginSuccess = () => {
    setToast({
      show: true,
      message: 'Đăng nhập thành công!',
      type: 'success'
    });
    
    // Lấy lại danh sách cặp tiền đã chọn từ database
    const token = localStorage.getItem('token');
    if (token) {
      fetchSavedPairs(token);
    }
    
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };

  const handleLoginError = () => {
    setToast({
      show: true,
      message: 'Đăng nhập thất bại. Vui lòng thử lại!',
      type: 'error'
    });
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };

  if (isLoading) {
    return <div className="sidebar-loading">Loading...</div>;
  }

  return (
    <div className="sidebar-content">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <h2>📈 Binance Tracker</h2>
      <div className="menu">
        {user ? (
          <>
            <div className="user-info">
              <img src={user.picture} alt="User" className="user-avatar" />
              <p className="wellcome-label">Welcome, {user.name}!</p>

              <button className="settings-btn" onClick={handleDropdownToggle}>
                🎛️ Select Pairs
              </button>

              {showDropdown && (
                <div className={`pair-selection ${isClosing ? 'closing' : ''}`}>
                  <div className="pair-checkbox-list">
                    {topPairs.map((pair) => (
                      <label key={pair} className="pair-checkbox">
                        <input
                          type="checkbox"
                          value={pair}
                          checked={selectedPairs.includes(pair)}
                          onChange={handlePairSelection}
                        />
                        {pair.toUpperCase()}
                      </label>
                    ))}
                  </div>
                  <button className="reset-btn" onClick={handleResetPairs}>🔄 Reset</button>
                </div>
              )}
            </div>
            <button
              className={activeTab === "user" ? "active" : ""}
              onClick={() => setActiveTab("user")}
            >
              👤 User Info
            </button>
            {user.role === "admin" && (
              <button
                className={`menu-item ${activeTab === "manage-users" ? "active" : ""}`}
                onClick={() => setActiveTab("manage-users")}
              >
                <span className="icon">👥</span>
                <span className="text">Manage Users</span>
              </button>
            )}
          </>
        ) : (
          <GoogleLoginButton 
            setUser={setUser} 
            setTopPairs={setTopPairs}
            onLoginSuccess={handleLoginSuccess}
            onLoginError={handleLoginError}
          />
        )}
        <button
          className={activeTab === "prices" ? "active" : ""}
          onClick={() => setActiveTab("prices")}
        >
          🔥 Live Prices
        </button>
        <button
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          ℹ️ Introduction
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
