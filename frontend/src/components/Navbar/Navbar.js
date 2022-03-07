import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Navbar.css";
import etsylogo from "../../images/Etsy_logo.svg.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
export default class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      userLoggedIn:true
    }
  }
  render() {

    return (
      /*
        Logo - image
        Searcbox
        Log IN/Log out
        Cart Icon with number
        */
      <div>
        <nav className="header">
          <Link className="header__link" to="/">
            <img className="header__logo" src={etsylogo} alt="Etsy-title" />
          </Link>
          <div className="header__search">
            <input type="text" className="header__inputsearchbox" />
            <SearchIcon className="header__inputsearchicon"></SearchIcon>
          </div>
          {!this.state.userLoggedIn && <Link className="header__link" to="/login">
            <div className="header__login">Sign in</div>
          </Link>
  }
          {this.state.userLoggedIn && <><Link className="header__link" to="/favourites">
            <div className="header__favourite">
              <FavoriteBorderOutlinedIcon />
            </div>
          </Link>
          <Link className="header__link" to="/shop">
            <div className="header__shop">
              <StoreOutlinedIcon />
            </div>
          </Link>
          <Link className="header__link" to="/checkout">
            <div className="header__shoppingcart">
              <ShoppingCartOutlinedIcon />
            </div>
          </Link>
          </> }
        </nav>
        <Outlet />
      </div>
    );
  }
}
