import React, { useState } from "react";
import CoinTable from "./CoinTable";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("prices");

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
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
            className={activeTab === "intro" ? "active" : ""}
            onClick={() => setActiveTab("intro")}
          >
            ℹ️ Introduction
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "prices" ? (
          <CoinTable />
        ) : (
          <div className="intro">
            <h2>Welcome to Binance Coin Tracker v2! 🚀</h2>
            <p>
              This platform provides real-time Binance cryptocurrency prices. Stay updated
              with the latest market trends and track your favorite coins effortlessly.
            </p>
            <p>🔹 Built with React.js & WebSockets</p>
            <p>🔹 Live market updates</p>
            <p>🔹 User-friendly UI</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
