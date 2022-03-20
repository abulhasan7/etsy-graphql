import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTokenAndCurrency } from '../../redux/selectors';
import CartItem from '../cartitem/CartItem';
import './orders.css';

function Orders(props) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}orders/get`, {
      mode: 'cors',
      headers: {
        Authorization: props.token,
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        if (!jsonresponse.error) {
          setOrders(jsonresponse.message);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!props.token) {
      navigate('../login', { replace: true });
    } else {
      getOrders();
    }
  }, []);

  return (
    <div className="orders_container">
      <div className="orders_header">Orders</div>
      {
      orders.map((order) => (
        <div className="order_container">
          <div className="order_header_container">
            <div className="order_orderid orderdet">
              Order No:
              {order.order_id}
            </div>
            <div className="order_date orderdet">
              Ordered On:
              {order.order_date}
            </div>
            <div className="order_totalprice orderdet">
              Total Price:
              {props.currency}
              {order.total_price}
            </div>
            <div className="order_totalquantity orderdet">
              Total Quantity:
              {order.total_quantity}
            </div>
          </div>
          <div className="order_items">
            {order.Order_Details.map(
              (item) => (
                <CartItem
                 // key={favourites[item.item_id] || item.item_id}
                  item={item}
                />
              ),
            )}
          </div>
        </div>
      ))
    }
      {
      orders.length <= 0 && <div className="no-orders">Oops! No Orders yet.</div>
    }

    </div>
  );
}

export default connect(getTokenAndCurrency, null)(Orders);
