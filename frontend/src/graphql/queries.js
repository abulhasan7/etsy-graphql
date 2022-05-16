/* eslint-disable import/prefer-default-export */
export const getAllItemsQuery = `{
    getAllItems{
        favourites{
            favId,
            itemId
        }
      items{
          _id,
          category,
          description,
          item_pic_url,
          name,
          price,
          sold_count,
          stock,
          shop{
              shop_id,
              shop_name,    
              shop_pic_url,
              
          }
      }
 
    }
 }`;

export const getAllOrdersQuery = `{
    getAllOrders{
        order_date,
        order_details{
            category,
            description,
            gift_description,
            item_name,
            item_pic_url,
            item_quantity,
            shop_id,
            shop_name,
            unit_price
        }
        total_price,
        total_quantity
    }
}`;

export const getSignedUrlQuery = `{
    getSignedUrl{upload_s3_url}
}`;

export const getShopDetailsOwnerQuery = `{
    getShopDetails{
        items{
            _id,
            name,
    item_pic_url,
    category,
    description,
    price,
    stock,
    sold_count,
        },
        shop{
            shop_id,
            shop_name,
            shop_pic_url,
            user{
                email,
                fullname,
                gender,
                phone,
                profile_pic_url,
                about,
                address_1,
                city,
                country,
                dob
            }
        },
        upload_s3_url
    }
}`;
export const getShopDetailsQuery = `query($shopId:String){
    getShopDetails(shopId:$shopId){
      
        items{
            _id,
            name,
    item_pic_url,
    category,
    description,
    price,
    stock,
    sold_count,
        },
        shop{
            shop_id,
            shop_name,
            shop_pic_url,
            user{
                email,
                fullname,
                gender,
                phone,
                profile_pic_url,
                about,
                address_1,
                city,
                country,
                dob
            }
        },
        favourites{
            itemId,favId
        }
    }
}`;

export const checkShopAvailabilityQuery = `query($shopName:String!){
    checkShopAvailability(shopName:$shopName)
}`;

export const getParamsForAddItemQuery = `{
    getParamsForAddItem{
        s3_upload_url,
        categories{
            categories
        }
    }
 }`;
