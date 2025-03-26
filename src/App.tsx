import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Import GoogleOAuthProvider
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Info from "./pages/Info";
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
// import "./styles.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("prices");

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">{activeTab === "prices" ? <Home /> : <Info />}</div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
