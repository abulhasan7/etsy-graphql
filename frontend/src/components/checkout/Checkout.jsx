/* eslint-disable prefer-promise-reject-errors */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import {
  getTokenCurrencyProfileAndCart,
} from '../../redux/selectors';
import { addCart, removeAllCart } from '../../redux/cartSlice';
import CartItem from '../cartitem/CartItem';
import './checkout.css';

function Checkout(props) {
  const [isModelOpen, setIsModelOpen] = useState(false);
  let totalPrice = 0.00;
  let totalItems = 0;
  let totalQuantity = 0;
  const navigate = useNavigate();
  Modal.setAppElement('#root');
  const customStyles = {
    content: {
      top: '35%',
      left: '30%',
      right: '30%',
      bottom: '35%',
    },
  };
  useEffect(() => {
    if (!props.token) {
      navigate('../login', { replace: true });
    }
  }, []);
  const handleModal = () => {
    setIsModelOpen((prevState) => !prevState);
  };
  const validate = () => new Promise((resolve, reject) => {
    if (!props.profile.address_1) {
      handleModal();
      reject('No Address');
    } else {
      resolve('Address Present');
    }
  });
  const purchaseItems = () => {
    validate()
      .then(() => fetch(`${process.env.REACT_APP_BACKEND_URL}orders/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: props.token,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          total_price: totalPrice,
          total_quantity: totalQuantity,
          orderDetails: Object.values(props.cart),
        }),
      }))
      .then((res) => res.json())
      .then(() => {
        props.removeAllCart();
        navigate('../orders');
      })
      .catch((error) => console.error(error));
  };
  return (
    <div className="checkout__container">
      {isModelOpen && (
      <Modal
        isOpen={isModelOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-wrapper">
          <div className="modal-text">
            You Have Not Updated Your Address Please update your address to
            place order.
          </div>
          <input type="button" onClick={handleModal} className="btn" value="Close" />
        </div>
      </Modal>
      )}
      <div className="checkout__header">Shopping Cart</div>
      {Object.keys(props.cart).length > 0 && (
      <>
        <div className="checkout__itemcontainer">
          {Object.values(props.cart).map((item) => {
            const pp = parseFloat(item.price).toFixed(2);
            totalPrice = (totalPrice + (pp * item.quantity)).toFixed(2);
            totalItems += 1;
            totalQuantity += item.quantity;
            return (
              <CartItem
              // key={favourites[item.item_id] || item.item_id}
                item={item}
                isCheckout
              />
            );
          })}
        </div>
        <div className="checkout__order">
          <div className="checkout__header2"> Subtotal</div>
          <div className="checkout__totalitems">
            <span>No of Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="checkout__totalitems">
            <span>Total Quantity:</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="checkout__totalprice">
            <span>Total Price:</span>
            {' '}
            <span>
              {props.currency}
              {totalPrice}
            </span>
          </div>
          <input
            type="button"
            value="Purchase Items"
            className="checkout__btn"
            onClick={purchaseItems}
          />
        </div>
      </>
      )}
      {
        Object.keys(props.cart).length <= 0 && <div className="no-cart">Oops! Nothing in the cart yet.</div>
      }
    </div>
  );
}

export default connect(getTokenCurrencyProfileAndCart, {
  addCart,
  removeAllCart,
})(Checkout);
