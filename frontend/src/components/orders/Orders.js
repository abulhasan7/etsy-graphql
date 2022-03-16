import React, { useEffect } from "react";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./orders.css";

function Orders(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    }
  }, []);
  return <div>Orders</div>;
}

export default Orders;
