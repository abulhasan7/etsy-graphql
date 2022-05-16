/* eslint-disable import/prefer-default-export */
export const getAllItemsQuery = `{
    getAllItems{
        favourites{
            favId,
            itemId
        }
      items{
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
