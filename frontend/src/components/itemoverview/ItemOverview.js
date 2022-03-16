import React, { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { connect } from "react-redux";
import { getToken } from "../../redux/selectors";
import { useNavigate } from "react-router-dom";
import "./itemoverview.css";

function ItemOverview(props) {
  const [isFavourite, setIsFavourite] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    }
  }, []);

  const handleFavouriteClick = () => {
    setIsFavourite((prevValue) => !prevValue);
  };
  return (
    <div className="item-overview-container">
      <div className="item-overview-image-container">
        <img
          src={
            "https://i.etsystatic.com/28277314/r/il/bbe7f1/2979414179/il_794xN.2979414179_ff0j.jpg"
          }
          alt={"Item overview Image"}
          className="item-overview-image"
        />
        <div className="item-overview-fav-icon">
          {isFavourite ? (
            <FavoriteIcon
              style={{ fontSize: 50 }}
              onClick={handleFavouriteClick}
            />
          ) : (
            <FavoriteBorderIcon
              style={{ fontSize: 50 }}
              onClick={handleFavouriteClick}
            />
          )}
        </div>
      </div>

      <div className="item-overview-details-container">
        <div className="item-overview-shop-name">Reliance Mart</div>
        <div className="item-overview-sales-count">1000 sales</div>
        <div className="item-overview-item-name">Poster Lalalal</div>
        <div className="item-overview-price">$100</div>
        <span className="item-overview-stock">In Stock</span>
        <div className="item-overview-quantity-container">
          <label
            className="item-overview-quantity-label"
            htmlFor="quantity-select"
          >
            Quantity Required
          </label>
          <select
            className="item-overview-quantity-select"
            id="quantity-select"
          >
            <option>Select an option</option>
            <option>1</option>
            <option>1</option>
          </select>
        </div>
        <input
          type={"button"}
          value="Add to Cart"
          className="item-overview-add-cart-btn"
        />
        <div className="item-overview-description-container">
          <label htmlFor="" className="item-overview-description-label">
            Description
          </label>
          <div className="item-overview-description-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(getToken, null)(ItemOverview);
