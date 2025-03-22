import React, { useEffect, useState } from "react";
import "../styles.css";
import GoogleLoginButton from "../components/GoogleLoginButton";

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
