import React, { Component } from "react";
import "./shopreg.css";
import { Alert } from "@mui/material";
import { Navigate } from "react-router-dom";
export default class ShopReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop_name: "",
      isAvailable: false,
      message: "",
      isRegistered:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleShopNameSubmit = this.handleShopNameSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleShopRegSubmit = this.handleShopRegSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "shop_name") {
      this.setState({ shop_name: event.target.value });
    } else {
      this.setState({ message: "" });
    }
  }
  handleValidation() {
    return new Promise((resolve, reject) => {
      let message = "";
      if (this.state.shop_name == "") {
        message = "Shop name can't be empty";
      } else if (this.state.shop_name.length < 4) {
        message = "Shop name can't be less than 4 characters";
      } else if (!this.state.shop_name.match("^[A-Za-z].*")) {
        message = "Shop name has to start with a character";
      }
      if (message !== "") {
        reject(message);
      } else {
        resolve("No Error");
      }
    });
  }

  handleShopNameSubmit(event) {
    event.preventDefault();
    let url = "http://localhost:3001/shops/check-availability?shop_name=";
    url += this.state.shop_name;
    this.handleValidation()
      .then((message) => {
        return fetch(url, {
          mode: "cors",
          credentials: "include",
        });
      })
      .then((response) => response.json())
      .then((jsonresp) => {
        if (jsonresp.message) {
          this.setState({
            message: (
              <Alert onClose={this.handleChange}>{jsonresp.message}</Alert>
            ),
            isAvailable: true,
          });
          console.log(jsonresp);
        } else {
          console.error("error in json request", jsonresp);
          return Promise.reject(jsonresp.error);
          // throw new Error(jsonresp.error);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          message: (
            <Alert severity="error" onClose={this.handleChange}>
              {error}
            </Alert>
          ),
          isAvailable: false,
        });
      });
  }

  handleShopRegSubmit(event){
    event.preventDefault();
    if(this.state.isAvailable){
      let url = "http://localhost:3001/shops/register";
      this.handleValidation()
        .then((message) => {
          return fetch(url, {
            mode: "cors",
            method:'POST',
            body:JSON.stringify(
              {
                shop_name:this.state.shop_name
              }
            ),
            headers:{
              'Content-Type':'application/json'
            },
            credentials: "include",
          });
        })
        .then((response) => response.json())
        .then((jsonresp) => {
          if (jsonresp.message) {
            this.setState({
              isRegistered: (
                <Navigate  replace to="/shop/home"/>
              ),
              isAvailable: true,
            });
            console.log(jsonresp);
          } else {
            console.error("error in json request", jsonresp);
            return Promise.reject(jsonresp.error);
            // throw new Error(jsonresp.error);
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            message: (
              <Alert severity="error" onClose={this.handleChange}>
                {error}
              </Alert>
            ),
            isAvailable: false,
          });
        });
    }else{
      this.setState({
        message: (
          <Alert severity="error" onClose={this.handleChange}>
            {"Shop Name not Available"}
          </Alert>
        ),
        isAvailable: false,
      });
    }
  
  }
  render() {
    return (
      
      <div className="shopreg__parent">
        {this.state.isRegistered}
        <form className="shopreg__form">
          <div className="shopreg__title">Name your shop</div>
          <div className="shopreg__tagname">
            Choose a memorable name that reflects your style
          </div>
          {this.state.message}
          <div className="shopreg__inputwrapper">
            <input
              type="text"
              className="shopreg__input"
              name="shop_name"
              value={this.state.shop_name}
              onChange={this.handleChange}
            />{" "}
            <input
              type="submit"
              className="shopreg__button_check"
              name="shopreg__button_check"
              value="Check Availability"
              onClick={this.handleShopNameSubmit}
            />
          </div>
          <div>
            Your shop name will appear in your shop and next to each of your
            listings througout Etsy.
          </div>
          <div> After you open your shop, you cannot change your name</div>
          <input
            type="submit"
            className="shopreg__button_register"
            value="Register Shop"
            onClick={this.handleShopRegSubmit}
            disabled={!this.state.isAvailable}
          />
        </form>
      </div>
    );
  }
}
