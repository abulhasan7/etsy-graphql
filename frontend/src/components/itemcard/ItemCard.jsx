import React, { useState,useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {getTokenAndCurrency } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./itemcard.css";

function ItemCard(props) {
  console.log("props are",props)
  
  const navigate = useNavigate();

  const handleFavouriteClick = () => {
    console.log("handle favourite")
    if (props.favourite.favouriteId) {
      removeFavourite();
    } else {
      addFavourite();
    }
  };

  
  const addFavourite = () => {
    fetch(process.env.REACT_APP_BACKEND_URL+"favourites/add", {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: props.token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        item_id: props.item.item_id,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        // console.log(jsonresponse);
        // console.log(jsonresponse.message);
        props.favourite.updateFavourites(
          prevState=>{ 
            // console.log("prev state is ",prevState)
            return {
              ...prevState,
              [(props.item).item_id]:jsonresponse.message
            }
          })
        console.log("success");
      })
      .catch((error) => console.log(error));
  };

  const removeFavourite = () => {
    fetch(process.env.REACT_APP_BACKEND_URL+"favourites/remove", {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: props.token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        favourite_id: props.favourite.favouriteId,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        // console.log(jsonresponse);
        if(jsonresponse.message){
          props.favourite.updateFavourites(
            prevState=> {
              return {
                ...prevState,
                [(props.item).item_id]:null
              }
            
            })
          // console.log("success");
        }

      })
      .catch((error) => console.log(error));
  };

  const handleCardClick = () => {
    if (props.handleModelOpen) {
      props.handleModelOpen({ ...props.item });
    } else {
      console.log("item is",props.item);
      navigate("/items/"+((props.item).name), { state: { item: props.item,favouriteId:props.favourite.favouriteId } });
    }
  };

  return (
    //TODO enable link
    <div className="itemcard" >
      <div className="itemcard__picwrapper">
        <img
          src={
            props.item.item_pic_url ||
            "https://i.etsystatic.com/28277314/r/il/bbe7f1/2979414179/il_794xN.2979414179_ff0j.jpg"
          }
          className="itemcard__pic" onClick={handleCardClick}
        />
        {!props.handleModelOpen && (
          <div className="item-overview-fav-icon">
            {props.favourite.favouriteId ? (
              <FavoriteIcon
                // style={{ fontSize: 30, color: "#F1641E" }}
                style={{ fontSize: 30, color: "#D9230F" }}
                onClick={handleFavouriteClick}
              />
            ) : (
              <FavoriteBorderIcon
                style={{ fontSize: 30, color: "#D9230F" }}
                onClick={handleFavouriteClick}
              />
            )}
          </div>
        )}
      </div>
      <div className="itemcard__contentwrapper">
        {/* <div className="itemcard__textwrapper"> */}
        <div className="itemcard__name">{props.item.name}</div>
        <div className="itemcard__price">
          <small>{props.currency}</small>
          {props.item.price}
        </div>
      </div>
    </div>
  );
}

export default connect(getTokenAndCurrency, null)(ItemCard);
