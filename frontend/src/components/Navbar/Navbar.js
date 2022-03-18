import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import etsylogo from "../../images/Etsy_logo.svg.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { addToken } from "../../redux/tokenSlice";
import {changeCurrency} from "../../redux/currencySlice";
import "./navbar.css";

function Navbar(props) {
  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const currencies = [
    "$ (USD)",
    "₹ (INR)",
    "£ (POUNDS)",
    "€ (EURO)",
    "¥ (YUAN)",
  ];

  useEffect(() => {
    if (currentPath === "/") {
      navigate("./home");
    }
  }, []);

  const handleSearchInput = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchClick = () => {
    navigate("./home", { state: { searchKeyword: searchKeyword } });
  };
  console.log("current path", currentPath);

  const handleCurrency = (event) =>{
    let symbol = event.target.value.substring(0,1);
    localStorage.setItem('currency',symbol);
    props.changeCurrency(symbol)
  }
  
  return (
    <div>
      <nav className="header">
        <Link className="header__link" to="/home">
          <img className="header__logo" src={etsylogo} alt="Etsy-title" />
        </Link>
        {props.token && (
          <>
            <div className="header__search">
              <input
                type="text"
                className="header__inputsearchbox"
                onChange={handleSearchInput}
              />
              <SearchIcon
                className="header__inputsearchicon"
                onClick={handleSearchClick}
              ></SearchIcon>
            </div>
            <Link className="header__link" to="/favourites">
              <div className="header__favourite">
                <FavoriteBorderOutlinedIcon />
              </div>
            </Link>
            <Link className="header__link" to="/shop/home">
              <div className="header__shop">
                <StoreOutlinedIcon />
              </div>
            </Link>
            <Link className="header__link" to="/checkout">
              <div className="header__shoppingcart">
                <ShoppingCartOutlinedIcon />
              </div>
            </Link>
            <Link
              to="/login"
              className="header__login"
              onClick={() => {
                props.addToken(null);
                localStorage.clear();
              }}
            >
              Log out
            </Link>
          </>
        )}
      </nav>
      <Outlet />
      <footer className="footer">
        <div className="footer_left">
          <div className="staticfont">United States</div>
          <div className="pipe">|</div>
          <div className="staticfont">English (US)</div>
          <div className="pipe">|</div>
          <select className="currency" onClick={handleCurrency}>
            {currencies.map((currency) => (
              <option className="currency">{currency}</option>
            ))}
          </select>
        </div>
        <div className="footer_right">
          <div className="staticfont">©2022 Etsy, Inc.</div>
          <div className="pipe">|</div>
          <div className="staticfont">Terms of Use</div>
          <div className="pipe">|</div>
          <div className="staticfont">Privacy</div>
          <div className="pipe">|</div>
          <div className="staticfont">Internet Based Ads</div>
        </div>
      </footer>
    </div>
  );
}

export default connect(getToken, { addToken,changeCurrency })(Navbar);
