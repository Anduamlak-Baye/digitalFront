import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/AdminAddItems.css";

function AdminAddItems() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
  const token = localStorage.getItem("adminToken");
  const savedId = localStorage.getItem("restaurantId");

  // Form Field States
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [vegan, setVegan] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // UI UX States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Forces file input element reset

  useEffect(() => {
    if (!token || !savedId) {
      navigate("/login");
      return;
    }

    axios
      .get(`${URL}/categories?resId=${savedId}`)
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0].categoryId);
        }
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, savedId, navigate, URL]);

  const handleSave = () => {
    // Basic Form Validations
    if (!itemName.trim() || !itemPrice.trim() || !selectedCategory) {
      alert("Please fill out Item Name, Price, and select a Category.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();

    formData.append("itemName", itemName.trim());
    formData.append("itemPrice", itemPrice);
    formData.append("description", itemDescription.trim());
    formData.append("itemImage", itemImage);
    formData.append("restaurantId", savedId);
    formData.append("categoryId", selectedCategory);
    formData.append("vegan", vegan);

    axios
      .post(`${URL}/addItem`, formData)
      .then(() => {
        alert("Item Added successfully!");

        // Reset all states safely
        setItemName("");
        setItemPrice("");
        setItemDescription("");
        setItemImage(null);
        setVegan(false);
        setFileInputKey(Date.now()); // Re-mounts the file selector to clear the filename
      })
      .catch((err) => {
        alert("Failed to add item. Please try again.");
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
    <div className="add-item-page">
      <div className="add-item-card">
        
        <header className="form-header">
          <h1>Add New Item</h1>
          <Link to="/admin-menu-items" className="back-link">← Cancel and return</Link>
        </header>

        {isLoading ? (
          <div className="form-loading">Preparing forms parameters...</div>
        ) : categories.length === 0 ? (
          <div className="form-warning">
            <p>You need to create at least one category before you can build menu items.</p>
            <Link to="/admin-categories"><button className="primary-form-btn">Go to Categories</button></Link>
          </div>
        ) : (
          <div className="form-body">
            
            <div className="field-group">
              <label htmlFor="itemName">Item Name</label>
              <input
                id="itemName"
                type="text"
                placeholder="e.g., Spicy Double Burger"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="itemPrice">Price (ETB)</label>
              <input
                id="itemPrice"
                type="number"
                placeholder="e.g., 450"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="itemDesc">Description</label>
              <textarea
                id="itemDesc"
                rows="3"
                placeholder="Briefly detail main ingredients, presentation details, etc..."
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>

            <div className="field-row-grid">
              <div className="field-group">
                <label htmlFor="itemCategory">Category</label>
                <select
                  id="itemCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkbox-container">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={vegan}
                    onChange={(e) => setVegan(e.target.checked)}
                  />
                  <span>Flag as Vegan</span>
                </label>
              </div>
            </div>

            <div className="field-group file-field-group">
              <label htmlFor="itemImage">Item Image Display Preview</label>
              <input
                id="itemImage"
                key={fileInputKey} // Keeps browser values safely in state boundaries
                type="file"
                accept="image/*"
                onChange={(e) => setItemImage(e.target.files[0])}
              />
            </div>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Uploading Content..." : "Add Item to Menu"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAddItems;