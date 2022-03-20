/* eslint-disable prefer-promise-reject-errors */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTokenAndUserId } from '../../redux/selectors';
import { addToken } from '../../redux/tokenSlice';
import ShopItemForm from '../shopitemform/ShopItemForm';
import ItemCard from '../itemcard/ItemCard';
import './shophome.css';

function ShopHome(props) {
  let totalSales = 0;
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

  const isOwner = !locationState.shop_id;

  function getShopDetails() {
    const url = isOwner
      ? `${process.env.REACT_APP_BACKEND_URL}shops/get`
      : `${process.env.REACT_APP_BACKEND_URL
      }shops/get?shopId=${
        locationState.shop_id}`;
    fetch(url, {
      credentials: 'include',
      mode: 'cors',
      headers: { Authorization: props.token },
    })
      .then((response) => response.json())
      .then((jsonresponse) => {
        if (jsonresponse.error) {
          if (jsonresponse.error === "Shop doesn't exist") {
            navigate('../../shop/register');
          }
        } else {
          setShopDetails((prevState) => ({
            ...prevState,
            shop_pic_url: jsonresponse.shop.shop_pic_url,
            user: jsonresponse.shop.User,
            upload_s3_url: jsonresponse.upload_s3_url,
            items: jsonresponse.items,
            shop_name: jsonresponse.shop.shop_name,
            itemChanged: false,
          }));
          if (!isOwner) {
            setFavourites(jsonresponse.favourites);
          }
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (!props.token) {
      navigate('../login', { replace: true });
    } else {
      getShopDetails();
    }
  }, [shopDetails.modelItem.itemChanged]);

  function handleModelOpen(item) {
    let tempItem = item;
    if (!item.item_id) {
      tempItem = {};
    }
    setShopDetails((prevState) => ({ ...prevState, isModelOpen: true, modelItem: tempItem }));
  }

  function handleModelClose(didItemChange) {
    console.log(didItemChange);
    setShopDetails((prevState) => ({
      ...prevState,
      isModelOpen: false,
      modelItem: { ...prevState.modelItem, itemChanged: didItemChange },
    }));
  }

  function handleChange(event) {
    if (event.target.name === 'file') {
      const url = URL.createObjectURL(event.target.files[0]);
      setShopDetails((prevState) => ({
        ...prevState,
        shop_pic_url: url,
        shop_pic_file: event.target.files[0],
      }));
    }
  }

  function handleValidation() {
    return new Promise((resolve, reject) => {
      let message = '';
      if (shopDetails.shop_pic_url === '' && shopDetails.shop_pic_file === '') {
        message = "Profile picture can't be empty";
      } else if (
        shopDetails.shop_pic_file
        && !shopDetails.shop_pic_file.type.startsWith('image')
      ) {
        message = 'Profile picture has to be an image file only';
      }

      if (message !== '') {
        const elem = (
          <Alert severity="error" onClose={handleChange}>
            {message}
          </Alert>
        );
        reject(false);
        setShopDetails((prevState) => ({ ...prevState, message: elem }));
      }
      resolve(true);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleValidation()
      .then(() => fetch(shopDetails.upload_s3_url, {
        method: 'PUT',
        body: event.target.files[0],
      }))
      .then((s3response) => {
        if (s3response && s3response.status !== 200) {
          return Promise.reject({
            message: 'Error occurred during uploading file',
          });
        } if (s3response && s3response.status === 200) {
          return Promise.resolve(shopDetails.upload_s3_url.split('?')[0]);
        }
        return Promise.resolve(shopDetails.shop_pic_url);
      })
      .then((s3url) => {
        const url = `${process.env.REACT_APP_BACKEND_URL}shops/update`;
        const body = {
          shop_pic_url: s3url,
        };
        return fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(body),
          headers: {
            Authorization: props.token,
            'Content-type': 'application/json',
          },
        });
      })
      .then((response) => {
        if (
          response.status === 200
          || response.status === 201
          || response.status === 400
        ) {
          return response.json();
        }
        return Promise.reject({
          message: 'Some error occured during update',
        });
      })
      .then((json) => {
        if (json.error) {
          return Promise.reject(json);
        }
        const localurl = URL.createObjectURL(event.target.files[0]);
        setShopDetails((prevState) => ({ ...prevState, shop_pic_url: localurl }));
      })
      .catch((error) => {
        const elem = (
          <Alert severity="error" onClose={handleChange}>
            {error.error}
          </Alert>
        );
        setShopDetails((prevState) => ({ ...prevState, message: elem }));
        console.error(error);
      });
  }

  const updateSalesCount = (count, index) => {
    if (!shopDetails.total_sales_updated) {
      if (index === shopDetails.items.length - 1 && totalSales !== 0) {
        setShopDetails((prevState) => (
          {
            ...prevState,
            shop_total_sales: totalSales,
            total_sales_updated: true,
          }));
      } else {
        totalSales += count;
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
      <div className="shopform">
        <div className="shopform__child1">
          <div className="shopform__child1_shopdetails">
            <label htmlFor="file1">
              <img
                src={
                  shopDetails.shop_pic_url
                  || 'https://smacksportswear.com/wp-content/uploads/2019/07/storefront-icon.jpg'
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
                {shopDetails.shop_total_sales}
                {' '}
                Sales
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
                shopDetails.user.profile_pic_url
                || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'
              }
              className="shopform__profile_image"
              alt="Shop Owner Pic"
            />
            <div className="owner_det">{shopDetails.user.fullname}</div>
            <div className="owner_det">
              Phone:
              {' '}
              {shopDetails.user.phone}
            </div>
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
      </div>
    </>
  );
}
export default connect(getTokenAndUserId, { addToken })(ShopHome);
