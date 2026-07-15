import { useEffect, useState , } from 'react';
import { PlusCircle, Edit, BarChart3, Settings, ArrowLeft, Image, Save } from 'lucide-react';
import '../Styles/SuperAdminPanel.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const URL  = import.meta.env.VITE_API_URL
const superToken = localStorage.getItem("superToken")

const handleLogOut = () => {
  localStorage.removeItem("superToken")
  
}

export default function SuperAdminPanel() {
  // State to track which "page" the admin is currently viewing
  const [currentPage, setCurrentPage] = useState('hub'); // 'hub', 'register', 'edit', 'analytics', 'settings'
  const navigate = useNavigate()

  // Sub-component rendering based on current state
  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <RegisterRestaurantPage onBack={() => setCurrentPage('hub')} />;
      case 'edit':
        return <EditRestaurantPage onBack={() => setCurrentPage('hub')} />;
      case 'analytics':
        return <PlaceholderPage title="System Analytics" description="View live metrics, menu clicks, and performance charts." onBack={() => setCurrentPage('hub')} />;
      case 'settings':
        return <PlaceholderPage title="Global Platform Settings" description="Configure global variables, tax rates, currencies, and system integrations." onBack={() => setCurrentPage('hub')} />;
      default:
        return <NavigationHub onNavigate={setCurrentPage} />;
    }
  };

   if (superToken) {
    return <div className="admin-wrapper">{renderPage()}</div> 
   }
   else{
      <div className="admin-wrapper">{navigate("/super-admin-login-page")}</div> ;

   }


}
/* ==========================================
   1. MAIN NAVIGATION HUB
   ========================================== */
function NavigationHub({ onNavigate }) {
  const menuItems = [
    {
      id: 'register',
      title: 'Register Restaurant',
      description: 'Onboard a new restaurant venue, upload branding assets, and set initial system status.',
      icon: <PlusCircle size={32} className="nav-icon text-primary" />,
    },
    {
      id: 'edit',
      title: 'Edit Restaurant Details',
      description: 'Modify existing restaurant names, swap out active logos, adjust operational settings, or disable accounts.',
      icon: <Edit size={32} className="nav-icon text-warning" />,
    },
    {
      id: 'analytics',
      title: 'System Analytics',
      description: 'Track digital menu interaction counts, QR code scans, and peak ordering windows across all properties.',
      icon: <BarChart3 size={32} className="nav-icon text-success" />,
    },
    {
      id: 'Log Out',
      title: 'Log Out',
      description: 'Log Out of your account',
      icon: <Settings size={32} className="nav-icon text-danger" />,
    }
  ];

  return (
    <div className="hub-container">
      <div className="hub-header">
        <h1 className="hub-title">Super Admin Management Console</h1>
        <p className="hub-subtitle">Select a control module to configure your digital menu network infrastructure.</p>
      </div>

      <div className="nav-grid">
        <Link to={"/super-admin-login-page"}><button onClick={handleLogOut}>Logout</button></Link>
        {menuItems.map((item) => (
          <button key={item.id} className="nav-card-button" onClick={() => onNavigate(item.id)}>
            <div className="card-icon-wrapper">{item.icon}</div>
            <div className="card-text-block">
              <h2 className="card-title">{item.title}</h2>
              <p className="card-description">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   2. REGISTER RESTAURANT PAGE
   ========================================== */
function RegisterRestaurantPage({ onBack }) {
  const [logoPreview, setLogoPreview] = useState('');
  const [restaurantName, setRestaurantName] = useState(''); 
  const [logoFile,setLogoFile] = useState('');
  const [userName,setUserName] = useState('')
  const [password,setPassword] = useState('')
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file)
       setLogoPreview(file);
        setLogoFile(file)
  };

  const handleRegistration = async (e) => {
    e.preventDefault()
  
    
    const formData = new FormData

    formData.append("resName" , restaurantName)
    formData.append("resLogo" , logoFile)
    formData.append("userName", userName)
    formData.append("password", password)
    
    
    try{
      const superToken = localStorage.getItem("superToken")
      const response = await axios.post(URL+ "/registerRestaurant",formData,
        {
          headers : {
            'Content-Type' : 'multipart/form-data',
            'Authorization': `Bearer ${superToken}`
          }
        }
      )
      console.log(response)
      alert("Registered a new Restaurant")
      
    }
    catch(error){
      console.error(error.message)
      alert("Failed To register")
    }

  }



  return (
    <div className="page-container">
      <title>KK</title>
      <button onClick={onBack} className="btn-back"><ArrowLeft size={16} /> Back to Dashboard</button>
      <div className="page-header">
        <h2 className="form-page-title">Register New Restaurant</h2>
        <p className="form-page-subtitle">Onboard a fresh branch into the digital menu network.</p>
      </div>

      <form className="admin-styled-form" onSubmit={handleRegistration}>
        <div className="form-field">
          <label className="field-label">Restaurant Brand Name</label>
          <input type="text" 
    value={restaurantName} 
    onChange={(e) => setRestaurantName(e.target.value)} type="text" className="text-input" placeholder="e.g., Bella Italia Bistro" required />
        </div>

        <div className="form-field">
          <label className="field-label">Upload Brand Logo File</label>
          <div className="logo-upload-box">
            {logoPreview ? <img src={logoFile} alt="Preview" className="uploaded-thumbnail" /> : <div className="fallback-thumbnail"><Image size={24} /></div>}
            <div>
              <input type="file" accept="image/*" id="register-logo" onChange={handleFileChange} className="hidden-input" />
              <label htmlFor="register-logo" className="file-trigger-btn">Choose Image Asset</label>
            </div>
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">Admin User Name</label>
          <input type="text" 
    value={userName} 
    onChange={(e) => setUserName(e.target.value)} type="text" className="text-input" placeholder="e.g., Bella Italia Bistro" required />
        </div>

        <div className="form-field">
          <label className="field-label">Admin Password</label>
          <input type="text" 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} type="text" className="text-input" placeholder="e.g., Bella Italia Bistro" required />
        </div>
        <div className="form-field">
          <label className="field-label">Default Menu Status</label>
          <select className="dropdown-select">
            <option value="Active">Active (Live QR Codes)</option>
            <option value="Inactive">Inactive (Maintenance Overlay)</option>
          </select>
        </div>

        <button  type="" className="btn-save-action"><Save size={18} /> Register Franchise</button>
      </form>
    </div>
  );
}

/* ==========================================
   3. EDIT RESTAURANT PAGE
   ========================================== */
function EditRestaurantPage({ onBack }) {
  const [restaurants,setRestaurants] = useState([])

  useEffect(() => {

    axios.get(URL + "/restaurantLists")
    .then(res => {
      console.log(typeof(res.data))
      setRestaurants(res.data)
    })
    .catch(err => {
      console.error(err)
    }) 

  },[]
)

  return (
    <div className="page-container">
      <button onClick={onBack} className="btn-back"><ArrowLeft size={16} /> Back to Dashboard</button>
      <div className="page-header">
        <h2 className="form-page-title">Modify Existing Venues</h2>
        <p className="form-page-subtitle">Select a live client business directory entry below to adjust configuration data.</p>
      </div>
      
      {/* Search/Selection list mockup */}
      <div className="edit-selection-list">
        {restaurants.map(res => (
          <div key={res.restaurantId} className="edit-row-item">
            <span className="row-item-name">{res.restaurantName}</span>
            <Link to={`/super-admin-edit-restaurant/${res.restaurantId}`}><button className="btn-row-edit" >Configure Properties</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   4. PLACEHOLDER VIEWS
   ========================================== */
function PlaceholderPage({ title, description, onBack }) {
  return (
    <div className="page-container">
      <button onClick={onBack} className="btn-back"><ArrowLeft size={16} /> Back to Dashboard</button>
      <div className="page-header">
        <h2 className="form-page-title">{title}</h2>
        <p className="form-page-subtitle">{description}</p>
      </div>
      <div className="empty-state-notice">This functional workflow context is linked ready for API controller injection.</div>
    </div>
  );
}