import React, { useState, useEffect } from "react";
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { store } from './store/store';
import Sidebar from "./components/Sidebar";
import BinanceRates from "./components/BinanceRates";
import Info from "./pages/About";
import InfoUser from "./pages/InfoUser";
import ManageUsers from "./pages/ManageUsers";
import { Routes } from './utils/routes';
import "./App.css";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <Router>
          <div className="app-container">
            <button 
              className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
              <Sidebar />
            </div>
            <div className="main-content">
              <RouterRoutes>
                <Route path={Routes.PRICES} element={<BinanceRates />} />
                <Route path={Routes.ABOUT} element={<Info />} />
                <Route path={Routes.USER} element={<InfoUser />} />
                <Route path={Routes.MANAGE_USERS} element={<ManageUsers />} />
                <Route path="/" element={<Navigate to={Routes.PRICES} replace />} />
              </RouterRoutes>
            </div>
          </div>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
