import React,{ useEffect,useState }  from 'react'
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ItemCard from "../itemcard/ItemCard";
import './favourites.css'

function Favourites(props) {

   //States
   const [favourites, setFavourites] = useState([]);
   const [profile,setProfile] = useState({});
   const [searchKeyword, setsearchKeyword] = useState("");
   
  const navigate = useNavigate();

  const getFavouritesAndProfile = () => {
    fetch("http://localhost:3001/favourites/get-all", {
      mode: "cors",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        console.log(jsonresponse);
        console.log(jsonresponse.message);
        setFavourites(jsonresponse.message.favourites);
        setProfile(jsonresponse.message.profile);
        console.log("success");
      })
      .catch((error) => console.log(error));
  };
  
  useEffect(()=>{
    if(!props.token){
      navigate("../login", { replace: true });
    }else{
      getFavouritesAndProfile();
    }
  },[])

  return (
    <div className="favourites-container">Favourites

    <div className='favourites-header'></div>
    <div className='favourites-items-container'>
      {favourites.map(favourite =>{
          return <ItemCard
            // key={favourites[item.item_id] || item.item_id}
            item={favourite.Item}
            favourite={{
              favouriteId: favourite.favourite_id,
              updateFavourites: setFavourites,
            }}
          />
      })}
    </div>
    </div>
  )
}

	export default connect(getToken,null)(Favourites);
