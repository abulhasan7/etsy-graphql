import './App.css';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import {BrowserRouter,Routes,Route,Outlet} from 'react-router-dom';
import Register from './components/register/Register';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<Navbar/>}>
      <Route path='login' element = {<Login/>}/>
      <Route path='register' element = {<Register/>}/>
      <Route path='profile' element = {<Profile/>}/>
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
