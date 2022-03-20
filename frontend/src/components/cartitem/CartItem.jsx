import React from 'react';
import { connect } from 'react-redux';
import { getCurrency } from '../../redux/selectors';
import './cartitem.css';

function CartItem(props) {
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
        <div className="cartitem__name">{props.item.item_name || props.item.name}</div>
        <div className="cartitem__sellername">
          Sold By:
          {' '}
          {props.item.Shop ? props.item.Shop.shop_name : props.item.shop_name}
        </div>
        <div className="cartitem__quantity">
          Quantity:
          {' '}
          {props.item.quantity || props.item.item_quantity}
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
  );
}

export default connect(getCurrency, null)(CartItem);
