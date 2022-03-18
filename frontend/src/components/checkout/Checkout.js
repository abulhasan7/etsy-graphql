import React, { useState,useEffect } from "react";
import { getTokenAndCart } from "../../redux/selectors";
import { addCart } from "../../redux/cartSlice";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../cartitem/CartItem";
import "./checkout.css";

function Checkout(props) {

  const totalPrice = useState(0);
  let tempPrice = 0;
  let totalItems = 0;
  let totalQuantity = 0;
  const navigate = useNavigate();
  console.log(props);

  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    }
  }, []);

  const purchaseItems = () =>{
    
  }
  return (
    <div className="checkout__container">
      <div className="checkout__itemcontainer">
        <div className="checkout__header">Shopping Cart</div>
      {Object.values(props.cart).map((item) => {
        tempPrice+=item.price*item.quantity;
        totalItems++;
        totalQuantity+=item.quantity
        console.log("temprice",tempPrice);
        return <CartItem
          // key={favourites[item.item_id] || item.item_id}
          item={item}
      />
      })}
      </div>
      <div className="checkout__order">
      <div className="checkout__header2"> Subtotal</div>
      <div className="checkout__totalitems"><span>No of Items:</span><span>{totalItems}</span></div> 
      <div className="checkout__totalitems"><span>Total Quantity:</span><span>{totalQuantity}</span></div> 
       <div className="checkout__totalprice"><span>Total Price:</span> <span>${tempPrice}</span></div>
        <input type="button" value='Purchase Items' className="checkout__btn"/>
      </div>
    </div>
  );
}

export default connect(getTokenAndCart, { addCart })(Checkout);
