import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Info from "./pages/Info";
// import "./styles.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("prices");

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">{activeTab === "prices" ? <Home /> : <Info />}</div>
    </div>
  );
};

export default App;
