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

      {/* LANGUAGE */}
      <div className="card">
        <label>Language</label>
        <select
          value={config.language}
          onChange={(e) => updateField("language", e.target.value)}
        >
          <option value="en">English</option>
          <option value="am">Amharic</option>
          <option value="or">Afaan Oromo</option>
        </select>
      </div>

      {/* CURRENCY */}
      <div className="card">
        <label>Currency</label>
        <select
          value={config.currency}
          onChange={(e) => updateField("currency", e.target.value)}
        >
          <option value="ETB">ETB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

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

      {/* SPICY LEVEL
      <div className="card">
        <label>Spicy Level (1-3)</label>
        <select
          value={config.spicyLevel}
          onChange={(e) => updateField("spicyLevel", e.target.value)}
        >
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div> */}

      {/* ALLERGEN
      <div className="card">
        <label>Allergen</label>
        <input
          type="text"
          placeholder="e.g. dairy"
          value={config.allergen}
          onChange={(e) => updateField("allergen", e.target.value)}
        />
      </div> */}

      {/* TAG */}
      {/* <div className="card">
        <label>Tag</label>
        <input
          type="text"
          placeholder="e.g. vegan, fast-food"
          value={config.tag}
          onChange={(e) => updateField("tag", e.target.value)}
        />
      </div> */}
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
    <button  onClick={() =>console.log(config)}  className="apply-btn">Apply Settings</button>
    </Link>
    
    </div>
  );
}

export default Settings;