import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/AdminEditItems.css";
import { useParams } from "react-router-dom";

function AdminEditItems() {

  const { id } = useParams();
  const URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken")
  const savedId = localStorage.getItem("restaurantId")

  const [item, setItem] = useState(null);
  const [form, setForm] = useState(null);
  const [ categories, setCategories ] = useState([])
  const [ changedCategory, setChangedCategory] = useState(null)

  useEffect(() => {
    axios.get(`${URL}/menuItems?id=${id}&resId=${savedId}`)
      .then(res => {
        const data = res.data;
        setItem(data);
        setForm(data);
      })
      .catch(err => console.error(err));

    axios.get(URL + `/categories?resId=${savedId}`)
    .then(res => {
      setCategories(res.data)
    })
    .catch(err => {
      console.log("Error During Categories Search ")
      console.error(err)
    })
  }, [id]);

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log(form)
    axios.patch(`${URL}/menuItems/${id}?restaurantId=${savedId}`, form,{
      headers : {
        Authorization: `Bearer ${token}`
      }})
      .then(res => {
       
        alert("Updated successfully");
      })
      .catch(err => console.error(err));
  };

  if (!form) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="admin-edit-page">

      <h1>Edit Menu Item</h1>

      <div className="edit-grid">

        {/* LEFT SIDE - IMAGE PREVIEW */}
        <div className="image-section">

          <img
            src={item.image}
            alt={item.name}
            className="preview-image"
          />

          <p className="hint">Live preview</p>

        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="form-section">

          <div className="field-group">
            <label>Name</label>
            <input
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Price</label>
            <input
              type="number"
              value={form.price || ""}
              onChange={(e) =>
                handleChange("price", Number(e.target.value))
              }
            />
          </div>

          <div className="field-group">
            <label>Description</label>
            <input
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Category</label>
            <select onChange={e => handleChange("categoryId", Number(e.target.value))}   value={form.categoryId}>
              {categories.map(C => (
                <option key={C.categoryId} value={C.categoryId} >{C.name}</option>

              ))}
            </select>
          </div>

       

          <div className="toggle-row">

            <label>
              Vegan
              <input
                type="checkbox"
                checked={!!form.vegan}
                onChange={(e) =>
                  handleChange("vegan", e.target.checked)
                }
              />
            </label>

            <label>
              Hidden
              <input
                type="checkbox"
                checked={!!form.hidden}
                onChange={(e) =>
                  handleChange("hidden", e.target.checked)
                }
              />
            </label>
            

          </div>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminEditItems;