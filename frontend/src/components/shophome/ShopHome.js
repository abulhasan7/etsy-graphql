import { Navigate } from "react-router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getToken } from "../../redux/selectors";
import { addToken } from "../../redux/tokenSlice";
import "./shophome.css";
import { Alert } from "@mui/material";
import ShopItemForm from "../shopitemform/ShopItemForm";
import ItemCard from "../itemcard/ItemCard";

class ShopHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shop_pic_url: "",
      shop_pic_file: "",
      shop_name: "",
      total_sales: "",
      user: {
        profile_pic_url: "",
        fullname: "",
        phone: "",
      },
      redirectVar: this.props.token ? (
        ""
      ) : (
        <Navigate replace to="/login"></Navigate>
      ),
      upload_s3_url: "",
      message: "",
      items: [],
      modelItem: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);

    this.handleModelClose = this.handleModelClose.bind(this);
    this.handleModelOpen = this.handleModelOpen.bind(this);
    this.getShopDetails = this.getShopDetails.bind(this);
  }

  handleModelOpen(item) {
    if (!item.item_id) {
      item = {};
    }
    this.setState({ isModelOpen: true, modelItem: item });
  }
  handleModelClose(didItemChange) {
    this.setState((prevState, props) => {
      return {
        isModelOpen: false,
        modelItem: { ...prevState.modelItem, itemChanged: didItemChange },
      };
    });
  }

  getShopDetails() {
    let url = "http://localhost:3001/shops/get";
    fetch(url, {
      credentials: "include",
      mode: "cors",
      headers: { Authorization: this.props.token },
    })
      .then((response) => response.json())
      .then((jsonresponse) => {
        console.log("jsonresponse", jsonresponse);
        if (jsonresponse.error) {
          let redirectVar = <Navigate replace to="/shop/register"></Navigate>;
          this.setState({ redirectVar: redirectVar });
        } else {
          console.log(jsonresponse);
          this.props.addToken(jsonresponse.token);
          this.setState({
            shop_name: jsonresponse.shop_name,
            shop_pic_url: jsonresponse.shop_pic_url,
            user: jsonresponse.user,
            upload_s3_url: jsonresponse.upload_s3_url,
            items: jsonresponse.items,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    if (this.props.token) {
      this.getShopDetails();
    }
  }
  componentDidUpdate() {
    if (this.state.modelItem.itemChanged) {
      this.getShopDetails();
      this.setState({ modelItem: {} });
    }
  }

  handleChange(event) {
    console.log(event);
    if (event.target.name === "file") {
      let url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        shop_pic_url: url,
        shop_pic_file: event.target.files[0],
      });
    }
  }

  handleValidation() {
    return new Promise((resolve, reject) => {
      let message = "";
      if (this.state.shop_pic_url === "" && this.state.shop_pic_file == "") {
        message = "Profile picture can't be empty";
      } else if (
        this.state.shop_pic_file &&
        !this.state.shop_pic_file.type.startsWith("image")
      ) {
        console.log(this.state.profile_pic_file.type);
        message = "Profile picture has to be an image file only";
      }

      if (message !== "") {
        console.log(message);
        let elem = (
          <Alert severity="error" onClose={this.handleChange}>
            {message}
          </Alert>
        );
        reject(false);
        this.setState({ message: elem });
      }
      resolve(true);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleValidation()
      .then(() => {
        if (this.state.shop_pic_file) {
          return fetch(this.state.upload_s3_url, {
            method: "PUT",
            body: this.state.shop_pic_file,
          });
        }
      })
      .then((s3response) => {
        console.log("s3resoibse", s3response);
        if (s3response && s3response.status !== 200) {
          return Promise.reject({
            message: "Error occurred during uploading file",
          });
        } else if (s3response && s3response.status === 200) {
          return Promise.resolve(this.state.upload_s3_url.split("?")[0]);
        } else {
          return Promise.resolve(this.state.shop_pic_url);
        }
      })
      .then((s3url) => {
        let url = "http://localhost:3001/shops/update";
        const body = {
          shop_pic_url: s3url,
        };
        return fetch(url, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(body),
          headers: {
            Authorization: this.props.token,
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
          let elem = <Alert onClose={this.handleChange}>{json.message}</Alert>;
          this.setState({ message: elem });
        }
      })
      .catch((error) => {
        console.log(error);
        let elem = (
          <Alert severity="error" onClose={this.handleChange}>
            {error.error}
          </Alert>
        );
        this.setState({ message: elem });
        console.error(error);
      });
  }

  render() {
    if (this.state.redirectVar) {
      return this.state.redirectVar;
    }

    return (
      <>
        {this.state.isModelOpen && (
          <ShopItemForm
            handleModelClose={this.handleModelClose}
            item={this.state.modelItem}
          />
        )}
        <form className="shopform" onSubmit={this.handleSubmit}>
          <div className="shopform__child1">
            <div className="shopform__child1_shopdetails">
            <img
              src={
                this.state.shop_pic_url ||
                "https://smacksportswear.com/wp-content/uploads/2019/07/storefront-icon.jpg"
              }
              className="shopform__image"
              alt="Shop Pic"
            />

             <div className="shopform__child1_text"> 
              <input
                type="file"
                name="file"
                className="shopform__button"
                onChange={this.handleChange}
              />
       
              <input type="submit" value="Save Image" className="btn" />
            </div>
            </div>
            <div className="shopform__middle">
            <span className="shopform__title">{this.state.shop_name}</span>
            <span className="shopform__title">1000 Sales</span>
              <input
                type="button"
                value="Add Item"
                onClick={this.handleModelOpen}
                className="shopform__btn btn"
              />
            </div>
            <div className="ownerdetails">
            <img
              src={
                this.state.user.profile_pic_url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
              className="shopform__image"
              alt="Shop Owner Pic"
            />
            <div className="owner_text">
            <div className="shopform__title">Owner Details</div>
            <div className="owner_det">Owner: {this.state.user.fullname}</div>
            <div className="owner_det">Contact: {this.state.user.phone}</div>
            </div>
            </div>
          </div>
          <div className="shopform__child2">
            <div className="shopform__itemcontainer">
              {this.state.items.map((item) => (
                <ItemCard
                  key={item.item_id}
                  item={item}
                  handleModelOpen={this.handleModelOpen}
                />
              ))}
            </div>
          </div>
        </form>
      </>
    );
  }
}
export default connect(getToken, { addToken })(ShopHome);
