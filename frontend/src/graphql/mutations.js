export const loginMutation = `mutation mutateLogin($email:String,$password:String) {
    login(loginInput:{
        email:$email,
        password:$password
    }){
        profile{
            profile_pic_url,
            phone,
            gender,
            fullname,
            email,
            dob,
            country,
            city,
            address_1,
            about
        }
        token
    }
}`;
export const registerMutation = `mutation register($email:String,$password:String,$fullname:String){
    register(registerInput:{
        email:$email,
        password:$password,
        fullname:$fullname
    }){
        token
    }
}`;

export const createOrderMutation = '';

export const updateProfileMutation = `mutation updateProfile($fullname:String,$email:String,$phone:String,$gender:String,
                    $dob:String,$about:String,$profile_pic_url:String,$address_1:String,$address_2:String,$city:String,$country:String){
    updateProfile(userInput:{
        fullname:$fullname,
        email:$email,
        phone:$phone,
        gender:$gender,
        dob:$dob,
        about:$about,
        profile_pic_url:$profile_pic_url,
        address_1: $address_1,
        address_2: $address_2,
        city:$city,
        country:$country,
    })
 }`;

export const registerShopMutation = `mutation($shopName:String) {
    registerShop(shopInput:{
        shop_name:$shopName,
    })
 }`;

export const updateShopMutation = `mutation($shopUrl:String) {
    updateShop(shopInput:{
        shop_pic_url:$shopUrl
    })
 }`;

export const addItemMutation = `mutation($name:String,$item_pic_url:String,$category:String,$description:String,$price:String,$stock:Int,$sold_count:Int) {
    addItem(itemInput:{
        name:$name,
        item_pic_url:$item_pic_url,
         category:$category,
         description:$description,
         price:$price,
         stock:$stock,
         sold_count:$sold_count,         
    })
 }`;
export const updateItemMutation = `mutation($name:String,$item_pic_url:String,$category:String,$description:String,$price:String,$stock:Int,$sold_count:Int,$item_id:String) {
    updateItem(itemInput:{
        name:$name,
        item_pic_url:$item_pic_url,
         category:$category,
         description:$description,
         price:$price,
         stock:$stock,
         sold_count:$sold_count,
         item_id:$item_id         
    })
 }`;
