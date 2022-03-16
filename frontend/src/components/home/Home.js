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
  const [filterRange,setFilterRange] = useState("");
  const [sortBy,setSortBy] = useState("");
  const [includeOutOfStock,setIncludeOutOfStock] = useState("");

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

  return (
    <div className="home-container">
      {items.map((item) => {
        if (searchKeyword) {
          if (searchKeyword === item.name) {
            return <ItemCard
              // key={favourites[item.item_id] || item.item_id}
              item={item}
              favourite={{
                favouriteId: favourites[item.item_id],
                updateFavourites: setFavourites,
              }}
            />;
          }
        } else {
         return <ItemCard
            // key={favourites[item.item_id] || item.item_id}
            item={item}
            favourite={{
              favouriteId: favourites[item.item_id],
              updateFavourites: setFavourites,
            }}
          />;
        }
      })}
    </div>
  );
}

export default connect(getToken, null)(Home);
