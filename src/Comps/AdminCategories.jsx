import { useState, useEffect } from "react";
import "../Styles/AdminCategories.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminCategories() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const savedId = localStorage.getItem("restaurantId");

  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token || !savedId) {
      navigate("/login");
      return;
    }

    axios
      .get(`${URL}/categories?resId=${savedId}`)
      .then((res) => {
        setCategories(res.data);
        setOriginalCategories(res.data);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, savedId, navigate, URL]);

  const handleToggleHidden = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.categoryId === id ? { ...c, hidden: !c.hidden } : c
      )
    );
  };

  const handleConfirm = async () => {
    const changedCategories = categories.filter((c) => {
      const original = originalCategories.find(
        (o) => o.categoryId === c.categoryId
      );
      return original ? original.hidden !== c.hidden : false;
    });

    // If nothing changed, just go back safely
    if (changedCategories.length === 0) {
      navigate("/admin-panel");
      return;
    }

    setIsSaving(true);


    axios
      .patch(`${URL}/categories`, changedCategories)
      .then(() => {
        setOriginalCategories(categories); // Sync state tracking references
        alert("Updated Successfully ")
        navigate("/admin-panel"); // Safe redirect *after* API completion updates successfully
      })
      .catch((err) => {
        console.error("Error saving category configurations:", err);
        alert("Failed to save changes. Please try again.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (!token || !savedId) {
    return <div className="admin-redirecting">Redirecting to Login...</div>;
  }

  return (
    <div className="admin-categories-page">
      
      {/* HEADER SECTION */}
      <header className="admin-top-section">
        <Link to="/admin-add-category">
          <button className="primary-action-btn">Add Category</button>
        </Link>
        <div className="section-title-group">
          <h1>Categories</h1>
          <p>Toggle section visibility options across consumer menu displays.</p>
        </div>
      </header>

      {/* MAIN LAYOUT ROWS CONTAINER */}
      <main className="admin-list-container">
        {isLoading ? (
          <div className="admin-list-loading">Loading configuration data...</div>
        ) : categories.length === 0 ? (
          <div className="admin-list-empty">No category partitions initialized yet.</div>
        ) : (
          <div className="admin-categories-list">
            {categories.map((category) => (
              <article
                className={`admin-category-row ${
                  category.hidden ? "item-state-hidden" : ""
                }`}
                key={category.categoryId}
              >
                <div className="admin-item-meta">
                  <h2 className="admin-item-name">{category.name}</h2>
                  <span
                    className={`status-badge ${
                      category.hidden ? "badge-hidden" : "badge-visible"
                    }`}
                  >
                    {category.hidden ? "Hidden" : "Visible"}
                  </span>
                </div>

                <div className="admin-item-actions">
                  <button
                    className={`toggle-action-btn ${category.hidden ? "unhide-variant" : ""}`}
                    onClick={() => handleToggleHidden(category.categoryId)}
                  >
                    {category.hidden ? "Unhide" : "Hide"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CONTROLS SAVE STRIP */}
        <footer className="admin-list-footer">
          <button 
            className="confirm-page-btn" 
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Saving Configuration..." : "Confirm & Save"}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default AdminCategories;