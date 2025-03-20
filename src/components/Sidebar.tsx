import React from "react";
import "../styles.css";

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
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
      </div>
    </div>
  );
};

export default Sidebar;
