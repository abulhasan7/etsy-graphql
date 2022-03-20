import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import Register from './components/register/Register';
import ShopReg from './components/shopreg/ShopReg';
import ShopHome from './components/shophome/ShopHome';
import Home from './components/home/Home';
import ItemOverview from './components/itemoverview/ItemOverview';
import Favourites from './components/favourites/Favourites';
import Checkout from './components/checkout/Checkout';
import Orders from './components/orders/Orders';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path="items/:item" element={<ItemOverview />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          {/* Seller Related routes, all comes under the route shop route */}
          <Route path="shop">
            <Route path="register" element={<ShopReg />} />
            <Route path="home" element={<ShopHome />} />
          </Route>
        </Route>
        <Route path="*" element={<div>Hey this is error page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
