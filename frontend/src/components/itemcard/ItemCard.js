import React, { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import "./itemcard.css";

function ItemCard(props) {
  console.log(props.favourite);
  const [favouriteId, setFavouriteId] = useState(
    props.favourite ? (props.favourite).favourite_id : undefined
  );
  console.log("laa", favouriteId, props.favourite);

  const handleFavouriteClick = () => {
    if (favouriteId) {
      removeFavourite();
    } else {
      addFavourite();
    }
  };

  const addFavourite = () => {
    fetch("http://localhost:3001/favourites/add", {
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
        console.log(jsonresponse);
        console.log(jsonresponse.message);
        setFavouriteId(jsonresponse.message);
        console.log("success");
      })
      .catch((error) => console.log(error));
  };

  const removeFavourite = () => {
    fetch("http://localhost:3001/favourites/remove", {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: props.token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        favourite_id: favouriteId,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        console.log(jsonresponse);
        console.log(jsonresponse.message);
        setFavouriteId();
        console.log("success");
      })
      .catch((error) => console.log(error));
  };

  const handleCardClick = () => {
    if (props.handleModelOpen) {
      props.handleModelOpen({ ...props.item });
    } else {
      console.log("todod user navigation");
    }
  };
  return (
    //TODO enable link
    // <Link className="header__link" to="/">
    <div className="itemcard" onClick={handleCardClick}>
      <div className="itemcard__picwrapper">
        <img
          src={
            props.item.item_pic_url ||
            "https://i.etsystatic.com/28277314/r/il/bbe7f1/2979414179/il_794xN.2979414179_ff0j.jpg"
          }
          className="itemcard__pic"
        />
        <div className="item-overview-fav-icon">
          {favouriteId ? (
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
      </div>
      <div className="itemcard__contentwrapper">
        {/* <div className="itemcard__textwrapper"> */}
        <div className="itemcard__name">{props.item.name}</div>
        <div className="itemcard__price">
          <small>$</small>
          {props.item.price}
        </div>
      </div>
    </div>
    // </Link>
  );
}

export default connect(getToken, null)(ItemCard);
