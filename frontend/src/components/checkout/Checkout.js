import React, {useEffect } from "react";
import {getTokenCurrencyAndCart } from "../../redux/selectors";
import { addCart,removeAllCart } from "../../redux/cartSlice";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../cartitem/CartItem";
import "./checkout.css";

function Checkout(props) {

  let total_price = 0;
  let totalItems = 0;
  let total_quantity = 0;
  const navigate = useNavigate();
  console.log(props);

  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    }
  }, []);

  const purchaseItems = () =>{
    // console.log("items",JSON.stringify({
    //   total_price:total_price,
    //   total_quantity:total_quantity,
    //   orderDetails:Object.values(props.cart)
    // }))
    fetch("http://localhost:3001/orders/create", {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: props.token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        total_price:total_price,
        total_quantity:total_quantity,
        orderDetails:Object.values(props.cart)
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        // console.log(jsonresponse);
        // console.log(jsonresponse.message);
        // console.log("success");
        // TODO navigate to orders
        props.removeAllCart();
        navigate("../orders");
      })
      .catch((error) => console.log(error));
  }
  return (
    <div className="checkout__container">
      <div className="checkout__itemcontainer">
        <div className="checkout__header">Shopping Cart</div>
      {Object.values(props.cart).map((item) => {
        total_price
    +=(parseFloat(item.price).toFixed(2))*item.quantity;
        totalItems++;
        total_quantity+=item.quantity
        return <CartItem
          // key={favourites[item.item_id] || item.item_id}
          item={item}
      />
      })}
      </div>
      <div className="checkout__order">
      <div className="checkout__header2"> Subtotal</div>
      <div className="checkout__totalitems"><span>No of Items:</span><span>{totalItems}</span></div> 
      <div className="checkout__totalitems"><span>Total Quantity:</span><span>{total_quantity}</span></div> 
       <div className="checkout__totalprice"><span>Total Price:</span> <span>{props.currency}{total_price
    }</span></div>
        <input type="button" value='Purchase Items' className="checkout__btn" onClick={purchaseItems}/>
      </div>
    </div>
  );
}

export default connect(getTokenCurrencyAndCart, { addCart,removeAllCart })(Checkout);
