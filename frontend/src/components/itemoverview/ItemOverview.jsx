import React, { useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTokenCurrencyAndCart } from '../../redux/selectors';
import { addCart, removeCart } from '../../redux/cartSlice';
import './itemoverview.css';

function ItemOverview(props) {
  const { item, favouriteId: tempFavouriteId } = useLocation().state;

  const [favouriteId, setFavouriteId] = useState(tempFavouriteId);
  const [itemInCart, setItemInCart] = useState(props.cart
    ? props.cart[item.item_id] !== undefined : false);

  const [itemQuantity, setItemQuantity] = useState();

  const navigate = useNavigate();

  const addFavourite = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}favourites/add`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: props.token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        item_id: item.item_id,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        setFavouriteId(jsonresponse.message);
      })
      .catch((error) => console.log(error));
  };

  const removeFavourite = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}favourites/remove`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: props.token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        favourite_id: favouriteId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setFavouriteId();
      })
      .catch((error) => console.error(error));
  };

  const handleFavouriteClick = () => {
    if (favouriteId) {
      removeFavourite();
    } else {
      addFavourite();
    }
  };

  useEffect(() => {
    if (!props.token) {
      navigate('../login', { replace: true });
    }
  }, []);

  const handleQuantitySelect = (event) => {
    if (event.target.value !== 'Select') {
      setItemQuantity(event.target.value);
    }
  };

  const handleAddtoCart = () => {
    const addItem = { ...item, quantity: parseInt(itemQuantity, 10) };
    props.addCart(addItem);
    setItemInCart(true);
  };

  const handleRemoveCart = () => {
    props.removeCart(item.item_id);
    setItemInCart(false);
  };
  return (
    <div className="item-overview-container">
      <div className="item-overview-image-container">
        <img
          src={
            item.item_pic_url
            || 'https://i.etsystatic.com/28277314/r/il/bbe7f1/2979414179/il_794xN.2979414179_ff0j.jpg'
          }
          alt="Item overview"
          className="item-overview-image"
        />
        <div className="item-overview-fav-icon">
          {favouriteId ? (
            <FavoriteIcon
              style={{ fontSize: 30, color: '#F1641E' }}
              onClick={handleFavouriteClick}
            />
          ) : (
            <FavoriteBorderIcon
              style={{ fontSize: 30, color: '#F1641E' }}
              onClick={handleFavouriteClick}
            />
          )}
        </div>
      </div>

      <div className="item-overview-details-container">
        <input
          type="button"
          className="item-overview-shop-name"
          onClick={() => navigate('../../shop/home', {
            state: {
              shop_id: item.shop.shop_id,
              shop_name: item.shop.shop_name,
            },
          })}
          value={item.shop.shop_name}
        />

        <div className="item-overview-sales-count">
          {item.sold_count}
          {' '}
          Sales
        </div>
        <div className="item-overview-item-name">{item.name}</div>
        <div className="item-overview-price">
          {props.currency}
          {item.price}
        </div>
        <span className="item-overview-stock">
          {item.stock > 0 ? 'In Stock    \u2714' : 'Sold Out \u274c'}
          {}
        </span>
        <div className="item-overview-quantity-container">
          <label
            className="item-overview-quantity-label"
            htmlFor="quantity-select"
          >
            Quantity Required
          </label>
          <select
            defaultValue={props.cart
              && props.cart[item.item_id] ? props.cart[item.item_id].quantity : undefined}
            disabled={item.stock < 1}
            className="item-overview-quantity-select"
            id="quantity-select"
            onChange={handleQuantitySelect}
          >
            <option>Select an option</option>
            {Array(item.stock)
              .fill()
              .map((v, i) => (
                <option>{i + 1}</option>
              ))}
          </select>
        </div>
        {itemInCart && <div className="addtocartmessage">Item in Cart</div>}
        <div className="cart-buttons">
          <input
            type="button"
            value="Add to Cart"
            disabled={item.stock < 1}
            onClick={handleAddtoCart}
            className="item-overview-add-cart-btn"
          />
          {itemInCart && (
            <input
              type="button"
              value="Remove from Cart"
              onClick={handleRemoveCart}
              className="item-overview-add-cart-btn"
            />
          )}
        </div>
        {itemInCart && (
          <input
            type="button"
            value="Proceed to Checkout"
            onClick={() => navigate('../checkout')}
            className="item-overview-add-cart-btn"
          />
        )}
        <div className="item-overview-description-container">
          <label htmlFor="" className="item-overview-description-label">
            Description
          </label>
          <div className="item-overview-description-text">
            {item.description
              || `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(getTokenCurrencyAndCart, { addCart, removeCart })(
  ItemOverview,
);
