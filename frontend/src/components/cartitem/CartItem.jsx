/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getCurrencyAndCart } from '../../redux/selectors';
import { modifyCartQuantity, modifyGiftOption, removeCart } from '../../redux/cartSlice';

import './cartitem.css';

function CartItem(props) {
  const [giftDescription, setGiftDescription] = useState(false);
  const handleQuantityChange = (event) => {
    props.modifyCartQuantity({
      item_id: props.item.item_id,
      quantity:
      parseInt(event.target.value, 10),
    });
  };
  const handleGiftDescription = (event) => {
    props.modifyGiftOption({ item_id: props.item.item_id, gift_description: event.target.value });
  };
  const handleRemoveCart = () => {
    props.removeCart(props.item.item_id);
  };
  return (
    <div className="cartitem__container">
      <div className="cartitem__image_container">
        <img
          src={
            props.item.item_pic_url
            || 'https://i.etsystatic.com/28277314/r/il/bbe7f1/2979414179/il_794xN.2979414179_ff0j.jpg'
          }
          alt="item"
          className="cartitem__image"
        />
      </div>
      <div className="cartitem__content_container">
        <div className="cartitem__left">
          <div className="cartitem__name">{props.item.item_name || props.item.name}</div>
          <div className="cartitem__sellername">
            Sold By:
            {' '}
            {props.item.shop ? props.item.shop.shop_name : props.item.shop_name}
          </div>
          {props.isCheckout && (
          <div className="cartitem__giftbox">
            <div>
              <label htmlFor="cartitem__giftbox_checkbox">Gift Packaging?</label>
              <input type="checkbox" id="cartitem__giftbox_checkbox" onClick={() => setGiftDescription((prevstate) => !prevstate)} />
            </div>
            {giftDescription && <textarea id="cartitem__giftbox_description" onChange={handleGiftDescription} />}
          </div>
          )}
          {!props.isCheckout && props.item.gift_description && (
          <div className="cartitem__order_packing">
            Gift Packaging:
            {' '}
            <div>{props.item.gift_description}</div>
            {' '}
          </div>
          )}
        </div>
        <div className="cartitem__right">
          <div className="cartitem__quantity">
            <label htmlFor="cartitem__quantityselect"> Quantity: </label>
            {' '}
            {props.isCheckout && (
            <>
              <select onChange={handleQuantityChange} defaultValue={props.item.quantity} className="cartitem-quantity-select" id="cartitem__quantityselect">
                {Array(props.item.stock + 1)
                  .fill(0).map((v, i) => (
                    <option>
                      {i}
                    </option>
                  ))}
              </select>
              <input type="button" value="Remove from Cart" onClick={handleRemoveCart} className="item-overview-add-cart-btn" />
            </>
            )}
            {
            !props.isCheckout && (props.item.quantity || props.item.item_quantity)
          }
          </div>
          <div className="cartitem__price">
            Price:
            {' '}
            {props.currency}
            {props.item.price || props.item.unit_price}
          </div>
          <div className="cartitem__totalprice">
            Total Price:
            {' '}
            {props.currency}
            {props.item.price
              ? (props.item.price * props.item.quantity).toFixed(2)
              : (props.item.unit_price * props.item.item_quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(getCurrencyAndCart, {
  modifyCartQuantity,
  modifyGiftOption,
  removeCart,
})(CartItem);
