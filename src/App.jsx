import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Items from './Comps/Items.jsx';
import ItemsDetail from './Comps/ItemDetail';
import AdminPanel from './Comps/AdminPanel.jsx';
import Login from './Comps/Login.jsx';
import AdminCategories from './Comps/AdminCategories.jsx';
import AdminMenuItems from './Comps/AdminMenuItems.jsx';
import UserSettings from './Comps/UserSettings.jsx'
import AdminEditItems from './Comps/AdminEditItems.jsx'
import QrGenerator from './Comps/QrGenerator.jsx';
import SuperAdminDashboard from './Comps/SuperAdminPanel.jsx';
import SuperAdminEditRestaurant from './Comps/SuperAdminEditRestaurant.jsx';
import AdminAddItems from './Comps/AdminAddItems.jsx';
import AdminAddCategory from './Comps/AdminAddCategory.jsx';
import SuperLogin from './Comps/SuperLogin.jsx';


function App(){


  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<h1>Fuck you nigga</h1>}/>
      {/* <Route path='/:restaurantId' element={<Items/>}/> */}
      <Route path='/:restaurantId' element={<h1>Second Page</h1>}/>
      
      <Route path='/item-detail/:resId/:id' element={<ItemsDetail/>}/>
      <Route path='/admin-panel' element = {<AdminPanel/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/admin-categories' element={<AdminCategories/>}/>
      <Route path='/admin-menu-items' element={<AdminMenuItems/>}/>
      <Route path='/user-settings/:resId' element={<UserSettings/>}/>
      <Route path='/admin-edit-items/:id' element={<AdminEditItems/>}/>
      <Route path='/qr-code' element={<QrGenerator/>}/>
      <Route path='/super-admin-panel' element={<SuperAdminDashboard/>}/>
      <Route path='/super-admin-edit-restaurant/:id' element={<SuperAdminEditRestaurant/>}/>
      <Route path='/admin-add-items' element={<AdminAddItems/>}/>
      <Route path='/admin-add-category' element={<AdminAddCategory/>}/>
      <Route path='/super-admin-login-page' element={<SuperLogin/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}


export default App;