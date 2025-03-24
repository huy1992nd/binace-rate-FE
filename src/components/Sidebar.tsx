import React, { useEffect, useState } from "react";
import { useRef } from "react";

import axios from "axios";
import "../styles.css";
import GoogleLoginButton from "../components/GoogleLoginButton";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [topPairs, setTopPairs] = useState<string[]>([]);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (token) fetchSavedPairs(token);
    
    fetchTopPairs();
    
    // ✅ Sync selected pairs when localStorage updates
    const handleStorageChange = () => {
      const updatedPairs = localStorage.getItem("selectedPairs");
      setSelectedPairs(updatedPairs ? JSON.parse(updatedPairs) : []);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // ✅ Save pairs to backend whenever `selectedPairs` changes
    if (user && selectedPairs.length > 0) {
      savePairsToBackend(selectedPairs);
    }
  }, [selectedPairs]);

  const fetchTopPairs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/crypto/top-pairs`);
      setTopPairs(response.data);
    } catch (error) {
      console.error("Failed to fetch top pairs", error);
    }
  };

  const fetchSavedPairs = async (token: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/crypto/get-pairs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedPairs = response.data;
      setSelectedPairs(savedPairs);
      console.log('in fetchSavedPairs', savedPairs);

      localStorage.setItem("selectedPairs", JSON.stringify(savedPairs));
    } catch (error) {
      console.error("Failed to fetch saved pairs", error);
    }
  };

  const savePairsToBackend = async (updatedPairs: string[]) => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/crypto/save-pairs`,
        { pairs: updatedPairs },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Failed to save selected pairs", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedPairs");
    setUser(null);
    setSelectedPairs([]);
    window.dispatchEvent(new Event("storage"));
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handlePairSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return; // Prevent multiple rapid updates
  
    setIsUpdating(true);
    const value = event.target.value;
    const isChecked = event.target.checked;
  
    setSelectedPairs((prevSelectedPairs) => {
      const updatedPairs = isChecked
        ? [...prevSelectedPairs, value]
        : prevSelectedPairs.filter((pair) => pair !== value);
  
      console.log("handlePairSelection:", updatedPairs);
      localStorage.setItem("selectedPairs", JSON.stringify(updatedPairs));
      window.dispatchEvent(new Event("storage"));
  
      return updatedPairs;
    });
  
    setTimeout(() => setIsUpdating(false), 200); // Small delay to prevent rapid state updates
  };

  const handleResetPairs = () => {
    setSelectedPairs([]);
    localStorage.removeItem("selectedPairs");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="sidebar">
      <h2>📈 Binance Tracker</h2>
      <div className="menu">
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

        {user ? (
          <div className="user-info">
            <img src={user.picture} alt="User" className="user-avatar" />
            <p className="wellcome-label">Welcome, {user.name}!</p>

            <button className="settings-btn" onClick={() => setShowDropdown(!showDropdown)}>
              🎛️ Select Pairs
            </button>

            {showDropdown && (
              <div className="pair-selection">
                <div className="pair-checkbox-list scrollable-list">
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
                <button className="reset-btn" onClick={handleResetPairs}>🔄 Reset Selection</button>
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </div>
        ) : (
          <GoogleLoginButton setUser={setUser} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
