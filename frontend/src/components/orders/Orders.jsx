import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CartItem from '../cartitem/CartItem';
import { getTokenAndCurrency } from '../../redux/selectors';
import './orders.css';
import { getAllOrdersQuery } from '../../graphql/queries';

function Orders(props) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(2);
  const [startIndex, setstartIndex] = useState(0);
  const [endIndex, setendIndex] = useState(2);

  const handleChange = (event, value) => {
    setstartIndex((value - 1) * ordersPerPage);
    setendIndex(Math.min(value * ordersPerPage, orders.length));
    setPage(value);
    console.log(startIndex, endIndex);
  };

  const getOrders = () => {
    fetch(process.env.REACT_APP_BACKEND_URL_GRAPHQL, {
      mode: 'cors',
      headers: {
        Authorization: props.token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        query: getAllOrdersQuery,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        if (!jsonresponse.error) {
          setOrders(jsonresponse.message);
          setendIndex(Math.min(page * ordersPerPage, jsonresponse.message.length));
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

  const handleordersPerPageChange = (event) => {
    const ordersPerPageVal = parseInt(event.target.value, 10);
    setOrdersPerPage(ordersPerPageVal);
    setstartIndex(0);
    setendIndex(Math.min(ordersPerPageVal, orders.length));
    setPage(1);
  };
  return (
    <div className="orders_container">
      <div className="orders_header">Orders</div>
      {
        orders.length > 1 && (
        <div className="orderPerPageContainer">
          <label htmlFor="ordersPerPage">Orders Per Page:</label>
          <select className="ordersPerPage" onChange={handleordersPerPageChange}>
            <option>2</option>
            <option>5</option>
            <option>10</option>
          </select>
        </div>
        )
      }
      {
      orders.slice(startIndex, endIndex).map((order) => (
        <div className="order_container">
          <div className="order_header_container">
            <div className="order_orderid orderdet">
              Order No:
              {order.order_id}
            </div>
            <div className="order_date orderdet">
              Ordered On:
              { order.order_date.substring(0, 10)}
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
            {order.order_details.map(
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
      orders.length > 1 && (
      <Stack spacing="2">
        <Pagination
          count={parseInt(Math.ceil(orders.length / ordersPerPage), 10)}
          page={page}
          onChange={handleChange}
        />
      </Stack>
      )
    }

      {
      orders.length <= 0 && <div className="no-orders">Oops! No Orders yet.</div>
    }

    </div>
  );
}

export default connect(getTokenAndCurrency, null)(Orders);
