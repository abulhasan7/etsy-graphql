import React, { Component } from "react";
import "./register.css";
import { Alert } from "@mui/material";
import {Navigate} from 'react-router'
import {getToken} from '../../redux/selectors'
import {connect} from 'react-redux'
import {addToken} from '../../redux/tokenSlice'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      fullname: "",
      password: "",
      confirmpassword: "",
      message: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }
  handleChange(event) {
    let value = event.target.value;
    console.log(event)
    if (event.target.name === "email") {
      this.setState({ email: value });
    } else if (event.target.name === "fullname") {
      this.setState({ fullname: value });
    } else if (event.target.name === "password") {
      this.setState({ password: value });
    } else if (event.target.name === "confirmpassword") {
      this.setState({ confirmpassword: value });
    } else {
      this.setState({ message: "" });
    }
  }

  handleValidation() {
    let message = "";
    if (this.state.email === "") {
      message = "Email cant be emtpy";
    } else if (
      this.state.email.match("^[A-Za-z0-9.]+@[A-Za-z0-9.-]+$") === null
    ) {
      message = "Email is not valid, enter valid email";
    } else if (this.state.fullname === "") {
      message = "Full Name can't be empty";
    } else if (this.state.fullname.length < 8) {
      message = "Full Name can't be less than 8 characters";
    } else if (this.state.password === "") {
      message = "Password can't be empty";
    } else if (this.state.password.length < 8) {
      message = "Password can't be less than 8 characters";
    } else if (this.state.confirmpassword === "") {
      message = "ConfirmPassword can't be empty";
    } else if (this.state.password !== this.state.confirmpassword) {
      message = "Password and Confirm Password don't match";
    }

    if (message !== "") {
      // console.log(json);
      let elem = (
        <Alert severity="error" onClose={this.handleChange}>
          {message}
        </Alert>
      );
      this.setState({ message: elem });
      return true;
    }
    return false;
  }
  handleSubmit(event) {
    event.preventDefault();
    if (!this.handleValidation()) {
      let url = "http://localhost:3001/users/register";
      fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          email: this.state.email,
          fullname: this.state.fullname,
          password: this.state.password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201 || response.status === 400) {
            return response.json();
          }else{ 
            return Promise.reject({
              message: "Some error occured during registration",
            });
          }
        })
        .then((json) => {
          if(json.error){
            return Promise.reject(json);
          }else{
          localStorage.setItem('token',json.token)
          this.props.addToken(json.token);
          let elem = <Navigate to="/home"></Navigate>;
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
  }
  render() {
    return (
      <div className="parent">
        <form className="registerform" onSubmit={this.handleSubmit}>
          <div className="registerform__heading">Register Here</div>
          {this.state.message}
          <div className="registerform__formgroup">
            <label htmlFor="email" className="loginfor__label">
              Email
            </label>
            <input
              type="text"
              className="registerform__input"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div className="registerform__formgroup">
            <label htmlFor="fullname" className="loginfor__label">
              Full Name
            </label>
            <input
              type="text"
              className="registerform__input"
              name="fullname"
              value={this.state.fullname}
              onChange={this.handleChange}
            />
          </div>
          <div className="registerform__formgroup">
            <label htmlFor="password" className="loginfor__label">
              Password
            </label>
            <input
              type="password"
              className="registerform__input"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="registerform__formgroup">
            <label htmlFor="confirmpassword" className="loginfor__label">
              Confirm Password
            </label>
            <input
              type="password"
              className="registerform__input"
              name="confirmpassword"
              value={this.state.confirmpassword}
              onChange={this.handleChange}
            />
          </div>
          <input
            type="submit"
            className="registerform__submit"
            name="register"
            value={"Register"}
            disabled={this.state.message}
          />
        </form>
      </div>
    );
  }
}
export default connect(getToken,{addToken})(Register)
