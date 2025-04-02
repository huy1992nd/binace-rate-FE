import React, { useState, useEffect } from "react";
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from './store/store';
import Sidebar from "./components/Sidebar";
import BinanceRates from "./components/BinanceRates";
import Info from "./components/Info";
import InfoUser from "./pages/InfoUser";
import ManageUsers from "./pages/ManageUsers";
import "./styles.css";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("prices");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setIsLoading(false);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "prices":
        return <BinanceRates />;
      case "info":
        return <Info />;
      case "user":
        return <InfoUser />;
      case "manage-users":
        return <ManageUsers />;
      default:
        return <BinanceRates />;
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <div className="app-container">
          <button className={`hamburger-menu open`}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`sidebar open`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="main-content">{renderContent()}</div>
        </div>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
