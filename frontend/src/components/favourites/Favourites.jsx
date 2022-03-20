import React,{ useEffect,useState }  from 'react'
import { getTokenAndFullName, getTokenAndProfile } from "../../redux/selectors";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ItemCard from "../itemcard/ItemCard";
import EditIcon from '@mui/icons-material/Edit';
import './favourites.css'

function Favourites(props) {

   //States
   const [favourites, setFavourites] = useState({});
   const [searchKeyword, setsearchKeyword] = useState("");
   let keyInput = "";
  const navigate = useNavigate();

  const getFavouritesAndProfile = () => {
    fetch(process.env.REACT_APP_BACKEND_URL+"favourites/get-all", {
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
    keyInput = event.target.value;
}
  return (
    <div className="favourites-container">
      <div className='favourites-header-container'>
      <div className="favourites-header__formimagegrid">
            <img
              src={
                props.profile.profile_pic_url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
              className="favourites_profileimage"
            ></img>
          </div>
    <div className='favourites-profile'>
      <div className='favourites-fullname'>{props.profile.fullname}</div>
    <EditIcon onClick={()=>navigate("../profile")}/>
    </div>
    </div>
    {(Object.keys(favourites).length>0 || favourites)&& <div className='favourites-data-container'>
      <div className='favourite-search'>
        <div className='favourite-title'>Favourite Items</div>
        <div>
        <input placeholder='Search your favourites' onChange={handleSearchInput} className="fav-search"/>
        <input type='button' value='Search' className='btn' onClick={handleSearch}/>
        </div>
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
    </div> }
    {
      Object.keys(favourites).length<1 && <div className='no-favourites'>Oops! No favourites yet.</div>
    }
    </div>
  )
}

	export default connect(getTokenAndProfile,null)(Favourites);
