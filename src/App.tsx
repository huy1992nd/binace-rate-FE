import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import GoogleOAuthProvider
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Info from "./pages/Info";
import InfoUser from "./pages/InfoUser";
import "./App.css";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
// import "./styles.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("prices");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "prices":
        return <Home />;
      case "info":
        return <Info />;
      case "user":
        return <InfoUser />;
      default:
        return <Home />;
    }
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
        <div className="main-content">{renderContent()}</div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
