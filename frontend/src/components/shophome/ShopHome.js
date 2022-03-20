import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getTokenAndUserId } from "../../redux/selectors";
import { addToken } from "../../redux/tokenSlice";
import "./shophome.css";
import { Alert } from "@mui/material";
import ShopItemForm from "../shopitemform/ShopItemForm";
import ItemCard from "../itemcard/ItemCard";
import { useNavigate, useLocation } from "react-router-dom";

function ShopHome(props) {
  let total_sales = 0;
  //uselocation hook
  const navigate = useNavigate();
  const locationState = useLocation().state || {};

  const [shopDetails, setShopDetails] = useState({
    shop_name: locationState.shop_name,
    shop_id: locationState.shop_id,
    shop_total_sales: 0,
    user: {},
    items: [],
    modelItem: {},
    isModelOpen: false,
  });
  const [favourites, setFavourites] = useState({});

  const isOwner = locationState.shop_id ? false : true;

  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    } else {
      getShopDetails();
    }
  }, []);

  function handleModelOpen(item) {
    if (!item.item_id) {
      item = {};
    }
    setShopDetails((prevState) => {
      return { ...prevState, isModelOpen: true, modelItem: item };
    });
  }

  function handleModelClose(didItemChange) {
    setShopDetails((prevState, props) => {
      return {
        ...prevState,
        isModelOpen: false,
        modelItem: { ...prevState.modelItem, itemChanged: didItemChange },
      };
    });
  }

  function getShopDetails() {
    let url = isOwner
      ? process.env.REACT_APP_BACKEND_URL + "shops/get"
      : process.env.REACT_APP_BACKEND_URL +
        "shops/get?shopId=" +
        locationState.shop_id;
    fetch(url, {
      credentials: "include",
      mode: "cors",
      headers: { Authorization: props.token },
    })
      .then((response) => response.json())
      .then((jsonresponse) => {
        console.log("jsonresponse", jsonresponse);
        if (jsonresponse.error) {
          if (jsonresponse.error === "Shop doesn't exist") {
            navigate("../../shop/register");
          }
        } else {
          console.log(jsonresponse);
          setShopDetails((prevState, props) => {
            return {
              ...prevState,
              shop_pic_url: jsonresponse.shop.shop_pic_url,
              user: jsonresponse.shop.User,
              upload_s3_url: jsonresponse.upload_s3_url,
              items: jsonresponse.items,
              shop_name: jsonresponse.shop.shop_name,
            };
          });
          if (!isOwner) {
            setFavourites(jsonresponse.favourites);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  function handleChange(event) {
    console.log(event);
    if (event.target.name === "file") {
      let url = URL.createObjectURL(event.target.files[0]);
      setShopDetails((prevState) => {
        return {
          ...prevState,
          shop_pic_url: url,
          shop_pic_file: event.target.files[0],
        };
      });
    }
  }

  function handleValidation() {
    return new Promise((resolve, reject) => {
      let message = "";
      if (shopDetails.shop_pic_url === "" && shopDetails.shop_pic_file == "") {
        message = "Profile picture can't be empty";
      } else if (
        shopDetails.shop_pic_file &&
        !shopDetails.shop_pic_file.type.startsWith("image")
      ) {
        console.log(shopDetails.profile_pic_file.type);
        message = "Profile picture has to be an image file only";
      }

      if (message !== "") {
        console.log(message);
        let elem = (
          <Alert severity="error" onClose={handleChange}>
            {message}
          </Alert>
        );
        reject(false);
        setShopDetails((prevState) => {
          return { ...prevState, message: elem };
        });
      }
      resolve(true);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleValidation()
      .then(() => {
        return fetch(shopDetails.upload_s3_url, {
          method: "PUT",
          body: event.target.files[0],
        });
      })
      .then((s3response) => {
        console.log("s3resoibse", s3response);
        if (s3response && s3response.status !== 200) {
          return Promise.reject({
            message: "Error occurred during uploading file",
          });
        } else if (s3response && s3response.status === 200) {
          return Promise.resolve(shopDetails.upload_s3_url.split("?")[0]);
        } else {
          return Promise.resolve(shopDetails.shop_pic_url);
        }
      })
      .then((s3url) => {
        let url = process.env.REACT_APP_BACKEND_URL + "shops/update";
        const body = {
          shop_pic_url: s3url,
        };
        return fetch(url, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(body),
          headers: {
            Authorization: props.token,
            "Content-type": "application/json",
          },
        });
      })
      .then((response) => {
        if (
          response.status === 200 ||
          response.status === 201 ||
          response.status === 400
        ) {
          return response.json();
        } else {
          return Promise.reject({
            message: "Some error occured during update",
          });
        }
      })
      .then((json) => {
        if (json.error) {
          return Promise.reject(json);
        } else {
          let localurl = URL.createObjectURL(event.target.files[0]);
          setShopDetails((prevState) => {
            return { ...prevState, shop_pic_url: localurl };
          });
          // let elem = <Alert onClose={handleChange}>{json.message}</Alert>;
          // setShopDetails((prevState) => {
          //   return { ...prevState, message: elem };
          // });
        }
      })
      .catch((error) => {
        console.log(error);
        let elem = (
          <Alert severity="error" onClose={handleChange}>
            {error.error}
          </Alert>
        );
        setShopDetails((prevState) => {
          return { ...prevState, message: elem };
        });
        console.error(error);
      });
  }

  const updateSalesCount = (count, index) => {
    console.log(total_sales, count, index, shopDetails.items.length);
    console.log(shopDetails.total_sales_updated, shopDetails.total_sales);
    if (!shopDetails.total_sales_updated) {
      if (index == shopDetails.items.length - 1 && total_sales != 0) {
        setShopDetails((prevState) => {
          console.log("prevstae is ", prevState);
          return {
            ...prevState,
            shop_total_sales: total_sales,
            total_sales_updated: true,
          };
        });
        // total_sales = 0;
      } else {
        total_sales += count;
      }
    }
  };
  return (
    <>
      {shopDetails.isModelOpen && (
        <ShopItemForm
          handleModelClose={handleModelClose}
          item={shopDetails.modelItem}
        />
      )}
      <form className="shopform" onSubmit={handleSubmit}>
        <div className="shopform__child1">
          <div className="shopform__child1_shopdetails">
            <label htmlFor="file1">
              <img
                src={
                  shopDetails.shop_pic_url ||
                  "https://smacksportswear.com/wp-content/uploads/2019/07/storefront-icon.jpg"
                }
                className="shopform__image"
                alt="Shop Pic"
              />
            </label>
            <div className="">
              <span className="shopform__title_main">
                {shopDetails.shop_name}
              </span>
              <div className="shopform__title">
                {shopDetails.shop_total_sales} Sales
              </div>
              {isOwner && (
                <input
                  type="button"
                  value="Add Item"
                  onClick={handleModelOpen}
                  className="shopform__btn btn"
                />
              )}
            </div>
            {isOwner && (
              <div className="shopform__child1_text">
                <input
                  id="file1"
                  type="file"
                  name="file"
                  className="shopform__file_button"
                  onChange={handleSubmit}
                />
              </div>
            )}
          </div>

          <div className="ownerdetails">
            <img
              src={
                shopDetails.user.profile_pic_url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
              className="shopform__profile_image"
              alt="Shop Owner Pic"
            />
            <div className="owner_det">{shopDetails.user.fullname}</div>
            <div className="owner_det">Phone: {shopDetails.user.phone}</div>
          </div>
        </div>
        <div className="shopform__child2">
          <div className="shopform__itemcontainer">
            {shopDetails.items.map((item, index) => {
              updateSalesCount(item.sold_count, index);
              return (
                <ItemCard
                  key={item.item_id}
                  item={{
                    ...item,
                    Shop: {
                      shop_name: shopDetails.shop_name,
                      shop_id: item.shop_id,
                    },
                  }}
                  handleModelOpen={isOwner ? handleModelOpen : undefined}
                  favourite={{
                    favouriteId: favourites[item.item_id],
                    updateFavourites: setFavourites,
                  }}
                />
              );
            })}
          </div>
        </div>
      </form>
    </>
  );
}
export default connect(getTokenAndUserId, { addToken })(ShopHome);
