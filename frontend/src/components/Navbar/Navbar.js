import React,{useState} from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import etsylogo from "../../images/Etsy_logo.svg.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { addToken } from "../../redux/tokenSlice";
import "./navbar.css";

function Navbar(props) {

  const [searchKeyword,setSearchKeyword] = useState("");

  const navigate = useNavigate();

  const handleSearchInput = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchClick = () => {
    console.log("the current search is", searchKeyword);
    navigate("./home",{state:{searchKeyword:searchKeyword}})
  };


  return (
    <div>
      <nav className="header">
        <Link className="header__link" to="/home">
          <img className="header__logo" src={etsylogo} alt="Etsy-title" />
        </Link>
        {props.token && (
          <>          <div className="header__search">
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
    </div>
  );
}

export default connect(getToken, { addToken })(Navbar);
