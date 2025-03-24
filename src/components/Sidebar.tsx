import React, { useEffect, useState } from "react";
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
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedPairs = localStorage.getItem("selectedPairs");
    if (storedPairs) {
      setSelectedPairs(JSON.parse(storedPairs));
    }

    fetchTopPairs();
  }, []);

  const fetchTopPairs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/crypto/top-pairs`);
      setTopPairs(response.data);
    } catch (error) {
      console.error("Failed to fetch top pairs", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedPairs");
    setUser(null);
    setSelectedPairs([]);
    // 🔹 Trigger a 'storage' event manually
    window.dispatchEvent(new Event("storage"));
  };

  const handlePairSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPairs((prevSelectedPairs) => {
      const updatedPairs = prevSelectedPairs.includes(value)
        ? prevSelectedPairs.filter((pair) => pair !== value)
        : [...prevSelectedPairs, value];
      localStorage.setItem("selectedPairs", JSON.stringify(updatedPairs));
      // 🔹 Trigger a 'storage' event manually
      window.dispatchEvent(new Event("storage"));
      return updatedPairs;
    });
  };

  const handleResetPairs = () => {
    setSelectedPairs([]);
    localStorage.removeItem("selectedPairs");
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
            <p>Welcome, {user.name}!</p>

            {/* 🔹 Show/hide pair selection */}
            <button className="settings-btn" onClick={() => setShowDropdown(!showDropdown)}>
              🎛️ Select Pairs
            </button>

            {/* 🔹 Hidden Pair Selection - Only visible when showDropdown is true */}
            {showDropdown && (
              <div className="pair-selection">
                <label className="pair-label">Select Your Pairs:</label>
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
                {/* 🔹 Reset Button */}
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
