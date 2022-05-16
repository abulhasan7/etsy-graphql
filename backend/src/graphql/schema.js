module.exports = `

type SignedUrl{
    upload_s3_url:String,
}

type User{
  fullname:String,
  email:String,
  phone:String,
  gender:String,
  dob:String,
  about:String,
  profile_pic_url:String,
  address_1:String,
  address_2:String,
  city:String,
  country:String
}

input UserInput{
  fullname:String,
  email:String,
  phone:String,
  gender:String,
  dob:String,
  about:String,
  profile_pic_url:String,
  address_1:String,
  address_2:String,
  city:String,
  country:String
}
type Shop{
  shop_id:String,
  shop_name:String,
  shop_pic_url:String,
  user:User
}

type Item{
  name:String,
  item_pic_url:String,
  category:String,
  description:String,
  price:String,
  stock:Int,
  sold_count:Int,
  shop:Shop,
}
input ItemInput{
  name:String,
  item_pic_url:String,
  category:String,
  description:String,
  price:String,
  stock:Int,
  sold_count:Int,
  shop:String,
  item_id:String
}
type ShopDetails{
  items:[Item],
  shop:Shop,
  upload_s3_url:String
}
type OrderDetails{
  item_quantity:Int,
  unit_price:String,
  shop_id:String,
  item_name:String,
  item_pic_url:String,
  category:String,
  description:String,
  shop_name:String,
  gift_description:String,

}
type Order{
  order_date:String,
  user_id:String,
  total_price:String,
  total_quantity:Int,
  order_details: [OrderDetails]
}
type Category{
  categories:[String]
}
type AddItemParams{
  categories:Category
  s3_upload_url:String
}
type ItemFavourite{
  itemId:String,
  favId:String
}
type ItemsWFavourites{
  items:[Item]
  favourites:[ItemFavourite]
}

type Query {
  getSignedUrl:SignedUrl,
  checkShopAvailability(shopName:String!):String,
  getShopDetails(shopId:String):ShopDetails,
  getAllOrders(userId:String):[Order],
  getParamsForAddItem:AddItemParams,
  getAllItems:ItemsWFavourites,
}

input AuthInput{
  email:String,
  password:String,
  fullname:String
}
type LoginOutput{
  token:String,
  profile:User
}
type RegisterOutput{
  token:String
}
input ShopInput{
  shop_name:String,
  user_id:String
  shop_id:String,
  shop_pic_url:String
}
 
input OrderDetail{
    quantity:Int,
    price:String,
    shop_id:String,
    name:String,
    item_pic_url:String,
    category:String,
    description:String,
    shop:ShopInput,
    gift_description:String,
  }
input OrderInput{
    total_price:String,
    total_quantity:Int,
    order_details: [OrderDetails]
}
type Mutation{
  login(loginInput:AuthInput):LoginOutput,
  register(registerInput:AuthInput):RegisterOutput,
  updateProfile(userInput:UserInput):String,
  registerShop(shopInput:ShopInput):String,
  updateShop(shopInput:ShopInput):String,
  addItem(itemInput:ItemInput):String,
  updateItem(itemInput:ItemInput):String,
  createOrder(orderInput:OrderInput):String
}
`;
