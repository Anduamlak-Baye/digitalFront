import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../Styles/SuperAdminEditRestaurant.css";

function SuperAdminEditRestaurant() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  // Consolidated Auth Checks
  const superToken = localStorage.getItem("superToken");

  // Core Data States
  const [restaurantId, setRestaurantId] = useState("");
  const [resName, setResName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // UI UX States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Structural Guard block
    if (!superToken) {
      navigate("/super-admin-login-page");
      return;
    }

    axios
      .get(`${URL}/restaurantLists?resId=${id}`, {
        headers: { Authorization: `Bearer ${superToken}` }
      })
      .then((res) => {
        const restData = res.data.restaurant || {};
        const adminData = res.data.admin || {};

        setRestaurantId(restData.restaurantId || "");
        setResName(restData.restaurantName || "");
        setIsActive(!!restData.active);
        setUserName(adminData.userName || "");
        setPassword(adminData.password || "");
      })
      .catch((err) => {
        console.error("Error reading restaurant configurations:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, superToken, navigate, URL]);

  const handleSave = () => {
    if (!resName.trim() || !userName.trim()) {
      alert("Restaurant Name and Admin Username cannot be empty.");
      return;
    }

    setIsSaving(true);
    console.log("Edit", superToken)
    axios
      .patch(
        `${URL}/editRestaurant`,
        {
          restaurantName: resName.trim(),
          restaurantId: restaurantId,
          active: isActive,
          userName: userName.trim(),
          password: password
        },
        {
          headers: { Authorization: `Bearer ${superToken}` }
        }
      )
      .then(() => {
        alert("Restaurant metrics updated successfully.");
        navigate("/super-admin-panel");
      })
      .catch((err) => {
        alert("Update operation failed.");
        console.error(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (!superToken) {
    return <div className="admin-redirecting">Redirecting to Login...</div>;
  }

  return (
    <div className="super-edit-page">
      <div className="super-edit-card">
        
        <header className="form-header">
          <h1>Edit Restaurant Management</h1>
          <Link to="/super-admin-panel" className="back-link">← Cancel</Link>
        </header>

        {isLoading ? (
          <div className="form-loading">Fetching profile data mapping...</div>
        ) : (
          <div className="form-body">
            
            <div className="field-group">
              <label htmlFor="resNameInput">Restaurant Business Name</label>
              <input
                id="resNameInput"
                type="text"
                value={resName}
                onChange={(e) => setResName(e.target.value)}
              />
            </div>

            <div className="field-group toggle-field-group">
              <label>System Operational Status</label>
              <div className="status-toggle-wrapper">
                <button
                  type="button"
                  className={`toggle-state-btn ${isActive ? "state-active" : "state-disabled"}`}
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? "ACTIVE / LIVE" : "SUSPENDED / INACTIVE"}
                </button>
                <p className="toggle-helper-text">
                  If suspended, users won't be able to scan or access menus assigned under this profile.
                </p>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="userInput">Primary Admin Username</label>
              <input
                id="userInput"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="passInput">Change Admin Password</label>
              <input
                id="passInput"
                type="text"
                value={password}
                placeholder="Leave unaltered to keep present hash"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="save-btn super-save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving Profiles..." : "Commit Administrative Updates"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminEditRestaurant;