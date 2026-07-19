import "../Styles/Items.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

function Items() {
  const { restaurantId } = useParams();
  const URL = import.meta.env.VITE_API_URL;

  // State Management
  const [currentCategory, setCurrentCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantDetails, setRestaurantDetails] = useState({
    restaurantName: "",
    restaurantLogo: "",
  });

  // Read local storage inside state initialization so it only hits disk once
  const [filter] = useState(() => {
    return JSON.parse(sessionStorage.getItem("menuConfig")) || {};
  });

  // Fetch all data reactively based on restaurantId
  useEffect(() => {
    if (!restaurantId) return;

    setIsLoading(true);

    const fetchMenuData = async () => {
      try {

        const localData = JSON.parse(sessionStorage.getItem(restaurantId))
        console.log(localData)
        if(localData){
            setItems(localData.items);
            setCategories(localData.categories);
            setRestaurantDetails({
              restaurantName: localData.restaurant.restaurantName,
              restaurantLogo: localData.restaurant.restaurantLogo,
            })
          return;

        }
        axios.get(URL + `/restaurantDetails?resId=${restaurantId}`)
        .then(res => {
        sessionStorage.setItem(restaurantId, JSON.stringify(res.data))
        console.log(res.data)
        setItems(res.data.items);
        setCategories(res.data.categories);
        setRestaurantDetails({
          restaurantName: res.data.restaurant.restaurantName,
          restaurantLogo: res.data.restaurant.restaurantLogo,
        });
     
        })
        .catch(err => {
          console.error(err)
        })

        
      } catch (error) {
        console.error("Error loading menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId, URL]); // Safe guard dependencies

  // Memoize categories filter
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => !c.hidden);
  }, [categories]);

  // Memoize filtered items so computation doesn't repeat on unrelated renders
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = currentCategory === 0 ||  item.categoryId === currentCategory;
      const matchesMaxPrice = !filter?.maxPrice || item.price <= Number(filter.maxPrice);
      const matchesVegan = !filter?.vegan || item.vegan;
      return matchesCategory && matchesMaxPrice && matchesVegan;
    });
  }, [items, currentCategory, filter]);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="menu-loading">
        <h2>Loading Menu...</h2>
      </div>
    );
  }

  // 2. Empty/Invalid fallback state (Only triggers after loading finishes)
  if (!restaurantDetails.restaurantName) {
    return (
      <div className="maintenance">
        <h2>Going Under Maintenance or Invalid Link</h2>
      </div>
    );
  }

  return (
    <div className="items-page">
      {/* HEADER */}
      <header className="menu-header">
        <div className="menu-header-left">
          <Link to={`/user-settings/${restaurantId}`}>
            <button className="header-btn">Settings</button>
          </Link>
          <Link to="/login">
            <button className="header-btn">Login</button>
          </Link>
        </div>

        <div className="restaurant-info">
          {restaurantDetails.restaurantLogo && (
            <img
              src={restaurantDetails.restaurantLogo}
              alt={restaurantDetails.restaurantName}
              className="restaurant-logo"
            />
          )}
          <h1 className="restaurant-name">
            {restaurantDetails.restaurantName}
          </h1>
          <p className="menu-title">Restaurant Menu</p>
        </div>
      </header>

      {/* CATEGORY BAR */}
      <section className="category-section">
        <button
          className={`category-btn ${currentCategory === 0 ? "active" : ""}`}
          onClick={() => setCurrentCategory(0)}
        >
          All
        </button>

        {filteredCategories.map((category) => (
          <button
            key={category.categoryId}
            className={`category-btn ${
              currentCategory === category.categoryId ? "active" : ""
            }`}
            onClick={() => (setCurrentCategory(category.categoryId, console.log(category.categoryId)))}
          >
            {category.name}
          </button>
        ))}
      </section>

      {/* ITEMS LIST */}
      <main className="items-grid">
        {filteredItems.length === 0 ? (
          <p className="no-items">No items match your selected filters.</p>
        ) : (
          filteredItems.map((item) => (
            <article className="item-card" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="item-image"
              />
              <div className="item-content">
                <h2 className="item-name">{item.name}</h2>
                <p className="item-price">{item.price} ETB</p>
                <Link to={`/item-detail/${restaurantId}/${item.item_id}`}>
                  <button className="view-btn">View Item</button>
                </Link>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

export default Items;