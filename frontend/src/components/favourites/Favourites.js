import React,{ useEffect,useState }  from 'react'
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ItemCard from "../itemcard/ItemCard";
import './favourites.css'

function Favourites(props) {

   //States
   const [favourites, setFavourites] = useState({});
   const [profile,setProfile] = useState({});
   const [searchKeyword, setsearchKeyword] = useState("");
   let keyInput = "";
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
        // console.log(jsonresponse);
        // console.log(jsonresponse.message);
        setFavourites(jsonresponse.message.favourites);
        setProfile(jsonresponse.message.profile);
        // console.log("success");
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

  const handleSearch = () =>{
      setsearchKeyword(keyInput);
  }
  const handleSearchInput = (event) =>{
    console.log(event.target.value )
    keyInput = event.target.value;
}
  return (
    <div className="favourites-container">
      <div className='favourites-header-container'>
    <div className='favourites-header'>Your Favourites!</div>
    <div className='favourites-profile'>
      <div className='favourites-fullname'>{profile.fullname}</div>
    <input type='button' value='Edit Profile' className='btn' onClick={()=>navigate("../profile")}/>
    </div>
    </div>
    <div className='favourites-data-container'>
      <div className='favourite-search'>
        <input placeholder='Search Here' onChange={handleSearchInput} className="fav-search"/>
        <input type='button' value='Search' className='btn' onClick={handleSearch}/>
      </div>
    <div className='favourites-items-container'>
      {Object.values(favourites).map(favourite =>{
        if(favourite ==null || (searchKeyword!="" && searchKeyword!=favourite.Item.name))
          return;
          return (<ItemCard
            // key={favourites[item.item_id] || item.item_id}
            item={favourite.Item}
            favourite={{
              favouriteId: favourite.favourite_id,
              updateFavourites: setFavourites,
            }}
          />)
      })}
    </div>
    </div>
    </div>
  )
}

	export default connect(getToken,null)(Favourites);
