import './App.css';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Register from './components/register/Register';
import ShopReg from './components/shopreg/ShopReg';
import ShopHome from './components/shophome/ShopHome';
import Home from './components/home/Home'
import ItemOverview from './components/itemoverview/ItemOverview';
import Favourites from './components/favourites/Favourites';
import Checkout from './components/checkout/Checkout';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<Navbar/>}>
      <Route path='login' element = {<Login/>}/>
      <Route path='register' element = {<Register/>}/>
      <Route path='profile' element = {<Profile/>}/>
      <Route path='home' element = {<Home/>}/>
      <Route path='item' element = {<ItemOverview/>}/>
      <Route path='favourites' element={<Favourites/>}/>
      <Route path='checkout' element={<Checkout/>}/>
      <Route path='shop'>
      <Route path='register' element = {<ShopReg/>}/>
      <Route path='home' element = {<ShopHome/>}/>
        </Route>
      </Route>
      {/*If nothing ;matches then the below page is displayedd */}
      <Route path = '*' element = {<div>Hey this is error page</div>}></Route>
    </Routes>
    </BrowserRouter>
        /* 
            COMMON
            /login/
            /logout/
            /checkout/
            /orders/
            /home/
            /search?keyword=
            /profile/
            /favourites/
            /shop/:item - view whole data regarding specific item //api to be added in BE

            /seller/shop/home/ - can edit shop name
            /seller/shop/edit-items/ - can edit items here
            
        */
  );
}

export default App;
