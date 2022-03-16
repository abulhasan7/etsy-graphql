import React, { useEffect, useState } from "react";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import ItemCard from "../itemcard/ItemCard";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";

function Home(props) {
  //States
  const [items, setItems] = useState([]);
  const [favourites, setFavourites] = useState({});
  const [filterRange, setFilterRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [includeOutOfStock, setIncludeOutOfStock] = useState(true);

  const navigate = useNavigate();

  const location = useLocation();

  const searchKeyword = location.state ? location.state["searchKeyword"] : "";

  const getAllItems = () => {
    fetch("http://localhost:3001/items/get-all", {
      mode: "cors",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        console.log(jsonresponse);
        console.log(jsonresponse.message);
        setItems(jsonresponse.message.items);
        setFavourites(jsonresponse.message.favourites);
        console.log("success");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    } else {
      getAllItems();
    }
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    if (value !== "Select") {
      const [lowRange, highRange] = event.target.value.split("-");
      setFilterRange({ lowRange: parseInt(lowRange), highRange: parseInt(highRange) });
    }
    // setFilterRange(value);
  };
  return (
    <div className="home-container">
      <div className="home-options-container">
        <select
          name="filter"
          id="priceFilter"
          className="home-options-price-select"
          // value={filterRange}
          onChange={handleFilterChange}
        >
          <option>Select</option>
          <option>0-100</option>
          <option>101-500</option>
          <option>501-1000</option>
          <option>1001-10000</option>
          <option>10001-1000000</option>
        </select>
      </div>
      <div className="home-items-container">
        {
          // filter = "";
          items.map((item) => {
            if (searchKeyword) {
              if (searchKeyword === item.name) {
                if (filterRange.highRange) {
                  let price = parseFloat(item.price).toFixed(2);
                  console.log("price is ",price);
                  console.log("range is ",filterRange.lowRange +" "+filterRange.highRange)
                  console.log("comparison", filterRange.lowRange <= price &&
                  filterRange.highRange >=price)
                  if (
                    filterRange.lowRange <= price &&
                    filterRange.highRange >= price
                  ) {
                    return (
                      <ItemCard
                        // key={favourites[item.item_id] || item.item_id}
                        item={item}
                        favourite={{
                          favouriteId: favourites[item.item_id],
                          updateFavourites: setFavourites,
                        }}
                      />
                    );
                  }
                } else {
                  return (
                    <ItemCard
                      // key={favourites[item.item_id] || item.item_id}
                      item={item}
                      favourite={{
                        favouriteId: favourites[item.item_id],
                        updateFavourites: setFavourites,
                      }}
                    />
                  );
                }
              }
            } else {
              if (filterRange.highRange) {
                let price = parseFloat(item.price).toFixed(2);
                console.log("price is ",price);
                console.log("range is ",filterRange.lowRange +" "+filterRange.highRange)
                console.log("comparison", filterRange.lowRange <= price &&
                filterRange.highRange >=price)
                if (
                  filterRange.lowRange <= price &&
                  filterRange.highRange >=price
                ) {
                  return (
                    <ItemCard
                      // key={favourites[item.item_id] || item.item_id}
                      item={item}
                      favourite={{
                        favouriteId: favourites[item.item_id],
                        updateFavourites: setFavourites,
                      }}
                    />
                  );
                }
              } else {
                return (
                  <ItemCard
                    // key={favourites[item.item_id] || item.item_id}
                    item={item}
                    favourite={{
                      favouriteId: favourites[item.item_id],
                      updateFavourites: setFavourites,
                    }}
                  />
                );
              }
            }
          })
        }
      </div>
    </div>
  );
}

export default connect(getToken, null)(Home);
