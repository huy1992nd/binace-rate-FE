import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import GoogleOAuthProvider
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Info from "./pages/Info";
import "./App.css";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
// import "./styles.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("prices");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="app-container">
        <button className={`hamburger-menu ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="main-content">{activeTab === "prices" ? <Home /> : <Info />}</div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
