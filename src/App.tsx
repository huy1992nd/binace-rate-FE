import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import GoogleOAuthProvider
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Info from "./pages/Info";
import InfoUser from "./pages/InfoUser";
import ManageUsers from "./pages/ManageUsers";
import "./App.css";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
// import "./styles.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Lấy active tab từ localStorage khi khởi tạo
    const savedTab = localStorage.getItem("activeTab");
    return savedTab || "prices";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lưu active tab vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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
      case "manage-users":
        return <ManageUsers />;
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
