import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/AdminAddCategory.css";

function AdminAddCategory() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const savedId = localStorage.getItem("restaurantId");

  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Router Auth Guard Check
  useEffect(() => {
    document.title = "Admin | Add Category "
    if (!token || !savedId) {
      navigate("/login");
    }
  }, [token, savedId, navigate]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      alert("Please enter a valid category name.");
      return;
    }

    setIsSaving(true);

    axios
      .post(`${URL}/addCategory`, {
        categoryName: categoryName.trim(),
        restaurantId: savedId,
      },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        alert("Category Added successfully!");
        setCategoryName(""); // Clears form field state parameters
      })
      .catch((err) => {
        alert("Failed to create category. Please try again.");
        console.error(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (!token || !savedId) {
    return <div className="admin-redirecting">Redirecting to Login...</div>;
  }

  return (
    <div className="add-category-page">
      <div className="add-category-card">
        
        <header className="form-header">
          <h1>Add Category</h1>
          <Link to="/admin-categories" className="back-link">
            ← Back to Categories
          </Link>
        </header>

        <div className="form-body">
          <div className="field-group">
            <label htmlFor="catName">Category Name</label>
            <input
              id="catName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              type="text"
              placeholder="e.g., Desserts, Main Course, Drinks"
              disabled={isSaving}
            />
          </div>

          <button 
            className="save-btn" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? "Creating Section..." : "Add Category"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminAddCategory;