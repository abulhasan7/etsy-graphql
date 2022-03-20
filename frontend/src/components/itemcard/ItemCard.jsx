import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTokenAndCurrency } from '../../redux/selectors';
import './itemcard.css';

function ItemCard(props) {
  const navigate = useNavigate();

  const addFavourite = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}favourites/add`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: props.token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        item_id: props.item.item_id,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        props.favourite.updateFavourites(
          (prevState) => ({
            ...prevState,
            [(props.item).item_id]: jsonresponse.message,
          }),

        );
      })
      .catch((error) => console.error(error));
  };

  const removeFavourite = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}favourites/remove`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: props.token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        favourite_id: props.favourite.favouriteId,
      }),
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        if (jsonresponse.message) {
          props.favourite.updateFavourites(
            (prevState) => ({
              ...prevState,
              [(props.item).item_id]: null,
            }),
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const handleFavouriteClick = () => {
    if (props.favourite.favouriteId) {
      removeFavourite();
    } else {
      addFavourite();
    }
  };
  const handleCardClick = () => {
    if (props.handleModelOpen) {
      props.handleModelOpen({ ...props.item });
    } else {
      navigate(`/items/${(props.item).name}`, { state: { item: props.item, favouriteId: props.favourite.favouriteId } });
    }
  };

  return (
    // TODO enable link
    <div className="itemcard">
      <div className="itemcard__picwrapper">
        <input
          type="image"
          src={
            props.item.item_pic_url
            || 'https://i.etsystatic.com/28277314/r/il/bbe7f1/2979414179/il_794xN.2979414179_ff0j.jpg'
          }
          alt="item"
          className="itemcard__pic"
          onClick={handleCardClick}
        />
        {!props.handleModelOpen && (
          <div className="item-overview-fav-icon">
            {props.favourite.favouriteId ? (
              <FavoriteIcon
                // style={{ fontSize: 30, color: "#F1641E"FDEBD2 D9230F }}
                style={{ fontSize: 30, color: '#F1641E' }}
                onClick={handleFavouriteClick}
              />
            ) : (
              <FavoriteBorderIcon
                style={{ fontSize: 30, color: '#F1641E' }}
                onClick={handleFavouriteClick}
              />
            )}
          </div>
        )}
      </div>
      <div className="itemcard__contentwrapper">
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
