import React,{ useEffect }  from 'react'
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import './favourites.css'

function Favourites(props) {

  const navigate = useNavigate();

  
  useEffect(()=>{
    if(!props.token){
      navigate("../login", { replace: true });
    }
  },[])

  return (
    <div>Favourites</div>
  )
}

	export default connect(getToken,null)(Favourites);
