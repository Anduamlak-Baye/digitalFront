import "../Styles/AdminMenuItems.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminMenuItems() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
  const token = localStorage.getItem("adminToken");
  const savedId = localStorage.getItem("restaurantId");

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin | Menu Items"

    // Single consolidated auth guard check
    if (!token || !savedId) {
      navigate("/login");
      return;
    }

    axios
      .get(`${URL}/menuItems?resId=${savedId}`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error("Error fetching menu items:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, savedId, navigate, URL]); // Safe guard dependencies

  // Block markup generation if unauthenticated
  if (!token || !savedId) {
    return <div className="admin-redirecting">Redirecting to Login...</div>;
  }

  return (
    <div className="admin-items-page">
      
      {/* TOP CONTROL BAR */}
      <header className="admin-top-section">
        <Link to="/admin-add-items">
          <button className="primary-action-btn">Add Item</button>
        </Link>

        <div className="section-title-group">
          <h1>Menu Items</h1>
          <p>Manage listing configurations, edit details, or toggle visibility states.</p>
        </div>

        <button className="contact-btn">
          Contact Developer
        </button>
      </header>

      {/* ITEMS LIST AREA */}
      <main className="admin-list-container">
        {isLoading ? (
          <div className="admin-list-loading">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="admin-list-empty">No menu items found. Get started by adding one!</div>
        ) : (
          <div className="admin-items-list">
            {items.map((item) => (
              <article 
                key={item.id} 
                className={`admin-item-row ${item.hidden ? "item-state-hidden" : ""}`}
              >
                <div className="admin-item-meta">
                  <h2 className="admin-item-name">{item.name}</h2>
                  <div className="admin-item-subtext">
                    <span className="admin-item-price">{item.price} ETB</span>
                    <span className={`status-badge ${item.hidden ? "badge-hidden" : "badge-visible"}`}>
                      {item.hidden ? "Hidden" : "Visible"}
                    </span>
                  </div>
                </div>

                <div className="admin-item-actions">
                  <Link to={`/admin-edit-items/${item.item_id}`}>
                    <button className="edit-action-btn">Edit</button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* BOTTOM GLOBAL ACTIONS */}
        <footer className="admin-list-footer">
          <Link to="/admin-panel">
            <button className="confirm-page-btn">Return to Dashboard</button>
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default AdminMenuItems;