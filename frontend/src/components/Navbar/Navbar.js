import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import etsylogo from "../../images/Etsy_logo.svg.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { addToken,removeToken } from "../../redux/tokenSlice";
import { changeCurrency } from "../../redux/currencySlice";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import "./navbar.css";

function Navbar(props) {
  //states
  const [searchKeyword, setSearchKeyword] = useState("");
  //hooks
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (currentPath === "/") {
      navigate("./home");
    }
  }, []);

  //other constants
  const currencies = [
    "$ (USD)",
    "₹ (INR)",
    "£ (POUNDS)",
    "€ (EURO)",
    "¥ (YUAN)",
  ];

  const handleSearchInput = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchClick = () => {
    navigate("./home", { state: { searchKeyword: searchKeyword } });
  };

  const handleCurrency = (event) => {
    let symbol = event.target.value.substring(0, 1);
    localStorage.setItem("currency", symbol);
    props.changeCurrency(symbol);
  };

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
            <>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("../profile");
                  }}
                >
                  <Avatar /> Profile
                </MenuItem>

                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate("../orders");
                  }}
                >
                  <Avatar /> Orders
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    console.log("called onclick");
                    props.removeToken(null);
                    navigate("../login");
                  }}
                >
                  <Avatar /> Log Out
                </MenuItem>
              </Menu>
            </>
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

export default connect(getToken, { addToken,removeToken ,changeCurrency })(Navbar);
