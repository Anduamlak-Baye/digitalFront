import { Link, useNavigate } from "react-router-dom";
import "../Styles/AdminPanel.css";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");
  const savedId = localStorage.getItem("restaurantId");

  const [stats, setStats] = useState({ cCategories: null, cItems: null });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogOut = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("restaurantId")
    navigate("/login")
  }

  useEffect(() => {
    // Auth Guard: Redirect early if credentials are missing
    if (!token || !savedId) {
      navigate("/login");
      return;
    }

    axios
      .get(`${URL}/counter?resId=${savedId}`) // Passing restaurant context to stats counter
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admin stats:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, savedId, navigate, URL]);

  // Prevent rendering markup completely if unauthenticated
  if (!token || !savedId) {
    return <div className="admin-redirecting">Redirecting to Login...</div>;
  }

  return (
    <div className="admin-container">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Menu Admin</h2>
          <span className="restaurant-id-tag">ID: {savedId}</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/admin-menu-items" className="nav-link">
            <span>Menu Items</span>
          </Link>
          <Link to="/admin-categories" className="nav-link">
            <span>Categories</span>
          </Link>
          <Link to="/qr-code" className="nav-link">
            <span>QR Codes</span>
          </Link>
          <button onClick={handleLogOut}>Log Out</button>
          
        </nav>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="admin-main-content">
        <header className="dashboard-header">
          <h1>Dashboard Overview</h1>
        </header>

        {/* STATS OVERVIEW CARDS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">
              {isLoading ? "..." : stats.cCategories ?? 0}
            </div>
            <div className="stat-label">Total Categories</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">
              {isLoading ? "..." : stats.cItems ?? 0}
            </div>
            <div className="stat-label">Active Menu Items</div>
          </div>
        </section>

       
      </main>

    </div>
  );
}

export default AdminPanel;