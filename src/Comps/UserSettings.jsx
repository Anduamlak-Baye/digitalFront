import { useEffect, useState } from "react";
import "../Styles/UserSettings.css";
import { Link, useParams } from "react-router-dom";

function Settings() {

  const {resId} = useParams()
  const [config, setConfig] = useState({
    language: "en",
    currency: "ETB",
    maxPrice: "",
    vegan: false
  });

  useEffect(() => {
    document.title = "User Settings"

    const saved = sessionStorage.getItem("menuConfig");
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const updateField = (field, value) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    sessionStorage.setItem("menuConfig", JSON.stringify(updated));
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings & Filters</h2>

     

      

      <hr className="section-divider" />

      {/* MAX PRICE */}
      <div className="card">
        <label>Max Price</label>
        <input
          type="number"
          value={config.maxPrice}
          onChange={(e) => updateField("maxPrice", e.target.value)}
        />
      </div>

      <div className="card">
  <label>Show Only Vegan</label>

  <button
    className={`toggle-btn ${config.vegan ? "active" : ""}`}
    onClick={() =>
      updateField("vegan", !config.vegan)
    }
  >
    {config.vegan ? "ON" : "OFF"}
  </button>
</div>

    <Link to={`/${resId}`}>
    <button className="apply-btn">Apply Settings</button>
    </Link>
    
    </div>
  );
}

export default Settings;