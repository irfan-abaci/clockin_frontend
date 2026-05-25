import React from "react";
import "./style.css"

interface TabProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CustomTabs: React.FC<TabProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div style={{ display: "flex",  borderBottom: "2px solid #ddd" }}>
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          padding: "10px 20px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          background: activeTab === tab ? "#f0f0f0" : "",
        }}
      >
        <span
          className={`gradient-text${activeTab === tab ? ' active' : ''}`}
         
        >
          {tab}
        </span>
      </button>
    ))}
  </div>
  );
};

export default CustomTabs;
