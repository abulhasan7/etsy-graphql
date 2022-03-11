import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import "./navbar.css";
import etsylogo from "../../images/Etsy_logo.svg.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {getToken} from '../../redux/selectors'
import {connect} from 'react-redux'
import {addToken} from '../../redux/tokenSlice'

class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
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
          {this.props.token && <div className="header__search">
            <input type="text" className="header__inputsearchbox" />
            <SearchIcon className="header__inputsearchicon"></SearchIcon>
          </div>
  }
          {/* {!this.props.token && <Link className="header__link" to="/login">
            <div className="header__login">Login</div>
          </Link>
  } */}
         {this.props.token && 
           <>
  
          <Link className="header__link" to="/favourites">
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
          <Link  to="/login" className="header__login" onClick={()=>{this.props.addToken(null);localStorage.clear()}}>Log out</Link>
          </> }
        </nav>
        <Outlet />
      </div>
    );
  }
}
export default connect(getToken,{addToken})(Navbar)
