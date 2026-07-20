import { Link, useParams } from "react-router-dom";
import "../Styles/ItemDetail.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ItemsDetail() {
  const URL = import.meta.env.VITE_API_URL;

  const { resId , id } = useParams();

  const [item, setItem] = useState(null);


  useEffect(() => {
    document.title = "Item Detail"

    const localData = JSON.parse(sessionStorage.getItem(resId))
    if(localData){
      const item = localData.items.find(i => i.item_id == id)
      setItem(item)
    }
    axios
      .get(URL + `/menuItems?resId=${resId}&id=${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (!item) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="detail-page">
      <Link to={`/${resId}`}>Go Back</Link>
      {/* IMAGE */}
      <div className="image-container">
        <img
          src={item.image}
          alt={item.name}
          className="detail-image"
        />

        {item.vegan  && (
          <span className="vegan-badge">🌱 Vegan</span>
        )}
      </div>

      {/* CONTENT */}
      <div className="detail-content">

        <div className="top-section">
          <h1>{item.name}</h1>

          <p className="price">
            ${item.price}
          </p>
        </div>

        <p className="description">
          {item.description}
        </p>

        {/* SPICY */}
        <div className="info-card">
          <h3>🌶 Spicy Level</h3>

          <div className="spicy-container">
            {[1, 2, 3].map(level => (
              <span
                key={level}
                className={
                  level <= item.spicyLevel
                    ? "pepper active"
                    : "pepper"
                }
              >
                🌶
              </span>
            ))}
          </div>
        </div>

        {/* INGREDIENTS */}
        <div className="info-card">
          <h3>🥬 Ingredients</h3>

          
        </div>

        <div className="info-card">
          <h3>🏷 Tags</h3>

         
        </div>

        
        <button className="order-btn">
          Order Now
        </button>

      </div>
    </div>
  );
}

export default ItemsDetail;