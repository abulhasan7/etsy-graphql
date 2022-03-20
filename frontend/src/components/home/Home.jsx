/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTokenFullNameAndCurrency } from '../../redux/selectors';
import ItemCard from '../itemcard/ItemCard';
import './home.css';

function Home(props) {
  // States
  const [items, setItems] = useState([]);
  const [favourites, setFavourites] = useState({});
  const [filterRange, setFilterRange] = useState('');
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const searchKeyword = location.state ? location.state.searchKeyword : '';

  const getAllItems = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}items/get-all`, {
      mode: 'cors',
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        setItems(jsonresponse.message.items);
        setFavourites(jsonresponse.message.favourites);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!props.token) {
      navigate('../login', { replace: true });
    } else {
      getAllItems();
    }
  }, []);

  const handleFilterChange = (event) => {
    const { value } = event.target;
    if (value !== 'Select') {
      const [lowRange, highRange] = event.target.value.split('-');
      setFilterRange({
        lowRange: parseInt(lowRange.substring(1), 10),
        highRange: parseInt(highRange, 10),
      });
    } else {
      setFilterRange({
        lowRange: undefined,
        highRange: undefined,
      });
    }
  };

  const handleOutOfStockChange = () => {
    setExcludeOutOfStock((prevValue) => !prevValue);
  };

  const sortItems = (value) => {
    const tempItems = [...items];
    if (value.startsWith('Price')) {
      tempItems.sort((item1, item2) => (
        parseFloat(item1.price).toFixed(2)
          - parseFloat(item2.price).toFixed(2)
      ));
    } else if (value === 'Quantity') {
      tempItems.sort((item1, item2) => item1.stock - item2.stock);
    } else if (value === 'Sales Count') {
      tempItems.sort((item1, item2) => item1.sold_count - item2.sold_count);
    }
    setItems(tempItems);
  };

  const handleSort = (event) => {
    const { value } = event.target;
    sortItems(value);
  };

  const getItem = (item) => (
    <ItemCard
      // key={favourites[item.item_id] || item.item_id}
      item={item}
      favourite={{
        favouriteId: favourites[item.item_id],
        updateFavourites: setFavourites,
      }}
    />
  );

  return (
    <div className="home-container">
      <div className="home-welcome">
        Welcome Back,
        {' '}
        {props.fullname}
        !
      </div>
      {items.length > 0 && (
        <div className="home-options-container">
          <div className="home-options-price">
            <label htmlFor="priceFilter">Filter by Price: </label>
            <select
              name="filter"
              id="priceFilter"
              className="home-options-price-select"
              onChange={handleFilterChange}
            >
              <option>Select</option>
              <option>
                {props.currency}
                0-100
              </option>
              <option>
                {props.currency}
                101-500
              </option>
              <option>
                {props.currency}
                501-1000
              </option>
              <option>
                {props.currency}
                1001-10000
              </option>
              <option>
                {props.currency}
                10001-1000000
              </option>
            </select>
          </div>
          <div className="home-options-sortby">
            <label htmlFor="sortyBy">Sort By: </label>
            <select
              name="sort"
              id="sortBy"
              className="home-options-price-select"
              onChange={handleSort}
            >
              <option>Select</option>
              <option>
                Price: (
                {props.currency}
                )
              </option>
              <option>Quantity</option>
              <option>Sales Count</option>
            </select>
          </div>
          <div className="home-options-checkbox">
            <label htmlFor="checkbox">Exclude Out of Stock: </label>
            <input
              type="checkbox"
              id="checkbox"
              value={excludeOutOfStock}
              onClick={handleOutOfStockChange}
            />
          </div>
        </div>
      )}
      <div className="home-items-container">
        {items.map((item) => {
          if (searchKeyword) {
            if (item.name.toUpperCase().includes(searchKeyword.toUpperCase())) {
              if (excludeOutOfStock) {
                if (item.stock > 0) {
                  if (filterRange.highRange) {
                    const price = parseFloat(item.price).toFixed(2);
                    if (
                      filterRange.lowRange <= price
                      && filterRange.highRange >= price
                    ) {
                      return getItem(item);
                    }
                  } else {
                    return getItem(item);
                  }
                }
              } else if (filterRange.highRange) {
                const price = parseFloat(item.price).toFixed(2);
                if (
                  filterRange.lowRange <= price
                    && filterRange.highRange >= price
                ) {
                  return getItem(item);
                }
              } else {
                return getItem(item);
              }
            }
          } else if (excludeOutOfStock) {
            if (item.stock > 0) {
              if (filterRange.highRange) {
                const price = parseFloat(item.price).toFixed(2);
                if (
                  filterRange.lowRange <= price
                    && filterRange.highRange >= price
                ) {
                  return getItem(item);
                }
              } else {
                return getItem(item);
              }
            }
          } else if (filterRange.highRange) {
            const price = parseFloat(item.price).toFixed(2);
            if (
              filterRange.lowRange <= price
                  && filterRange.highRange >= price
            ) {
              return getItem(item);
            }
          } else {
            return getItem(item);
          }
        })}
        {items.length < 1 && <div className="home-no-items">Oops! No Items Found.</div>}
      </div>
    </div>
  );
}

export default connect(getTokenFullNameAndCurrency, null)(Home);
