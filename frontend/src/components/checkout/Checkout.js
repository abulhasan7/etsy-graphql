import React, { useEffect, useState } from "react";
import {
  getTokenCurrencyAndCart,
  getTokenCurrencyProfileAndCart,
} from "../../redux/selectors";
import { addCart, removeAllCart } from "../../redux/cartSlice";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../cartitem/CartItem";
import Modal from "react-modal";
import "./checkout.css";

function Checkout(props) {
  const [isModelOpen, setIsModelOpen] = useState(false);
  let total_price = 0;
  let totalItems = 0;
  let total_quantity = 0;
  const navigate = useNavigate();
  console.log(props);
  Modal.setAppElement("#root");
  const customStyles = {
    content: {
      top: "35%",
      left: "30%",
      right: "30%",
      bottom: "35%",
    },
  };
  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    }
  }, []);
  const handleModal = () => {
    setIsModelOpen((prevState, props) => !prevState);
  };
  const validate = () => {
    return new Promise((resolve, reject) => {
      if (!props.profile.address_1) {
        handleModal();
        reject("No Address");
      } else {
        resolve("Address Present");
      }
    });
  };
  const purchaseItems = () => {
    validate()
      .then(() => {
        return fetch("http://localhost:3001/orders/create", {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: props.token,
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            total_price: total_price,
            total_quantity: total_quantity,
            orderDetails: Object.values(props.cart),
          }),
        });
      })
      .then((res) => res.json())
      .then((jsonresponse) => {
        props.removeAllCart();
        navigate("../orders");
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="checkout__container">
      <Modal
        isOpen={isModelOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={this.handleModelClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-wrapper">
          <div className="modal-text">
            You Have Not Updated Your Address Please update your address to
            place order.
          </div>
          <button onClick={handleModal} className="btn">
            Close
          </button>
        </div>
      </Modal>
      <div className="checkout__header">Shopping Cart</div>
      <div className="checkout__itemcontainer">
        {Object.values(props.cart).map((item) => {
          total_price += parseFloat(item.price).toFixed(2) * item.quantity;
          totalItems++;
          total_quantity += item.quantity;
          return (
            <CartItem
              // key={favourites[item.item_id] || item.item_id}
              item={item}
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
          <span>{total_quantity}</span>
        </div>
        <div className="checkout__totalprice">
          <span>Total Price:</span>{" "}
          <span>
            {props.currency}
            {total_price}
          </span>
        </div>
        <input
          type="button"
          value="Purchase Items"
          className="checkout__btn"
          onClick={purchaseItems}
        />
      </div>
    </div>
  );
}

export default connect(getTokenCurrencyProfileAndCart, {
  addCart,
  removeAllCart,
})(Checkout);
