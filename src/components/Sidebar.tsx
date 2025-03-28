import React, { useEffect, useState } from "react";
import axiosInstance, { handleLogout } from '../services/auth';
import "../styles.css";
import GoogleLoginButton from "../components/GoogleLoginButton";

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [topPairs, setTopPairs] = useState<string[]>([]);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle user data and initial pairs fetch
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (token) fetchSavedPairs(token);
    
    fetchTopPairs();
  }, []);

  // Handle localStorage changes for selected pairs
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPairs = localStorage.getItem("selectedPairs");
      if (updatedPairs) {
        setSelectedPairs(JSON.parse(updatedPairs));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save pairs to backend when selectedPairs changes
  useEffect(() => {
    if (user && selectedPairs.length > 0) {
      savePairsToBackend(selectedPairs);
    }
  }, [selectedPairs, user]);

  const fetchTopPairs = async () => {
    try {
      const response = await axiosInstance.get('/crypto/top-pairs');
      setTopPairs(response.data);
    } catch (error) {
      console.error("Failed to fetch top pairs", error);
      handleLogout();
    }
  };

  const fetchSavedPairs = async (token: string) => {
    try {
      const response = await axiosInstance.get('/crypto/get-pairs');
      const savedPairs = response.data;
      setSelectedPairs(savedPairs);
      console.log('in fetchSavedPairs', savedPairs);

      localStorage.setItem("selectedPairs", JSON.stringify(savedPairs));
    } catch (error) {
      console.error("Failed to fetch saved pairs", error);
      handleLogout();
    }
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
  
    const updatedPairs = isChecked
      ? [...selectedPairs, value]
      : selectedPairs.filter((pair) => pair !== value);
  
    console.log("handlePairSelection:", updatedPairs);
    setSelectedPairs(updatedPairs);
    localStorage.setItem("selectedPairs", JSON.stringify(updatedPairs));
    window.dispatchEvent(new Event("storage"));
  
    setTimeout(() => setIsUpdating(false), 200);
  };

  const handleResetPairs = () => {
    setSelectedPairs([]);
    localStorage.removeItem("selectedPairs");
    window.dispatchEvent(new Event("storage"));
  };

  const handleDropdownToggle = () => {
    if (showDropdown) {
      setIsClosing(true);
      setTimeout(() => {
        setShowDropdown(false);
        setIsClosing(false);
      }, 500);
    } else {
      setShowDropdown(true);
    }
  };

  return (
    <div className="sidebar-content">
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
          </>
        ) : (
          <GoogleLoginButton setUser={setUser} />
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
