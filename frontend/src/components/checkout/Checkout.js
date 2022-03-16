import React, { useEffect } from 'react'
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import './checkout.css';

function Checkout(props) {

  const navigate = useNavigate();

  useEffect(()=>{
    if(!props.token){
      navigate("../login", { replace: true });
    }
  },[])
  return (
    <div>Checkout</div>
  )
}

export default connect(getToken,null)(Checkout);
