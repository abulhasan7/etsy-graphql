import React, { Component } from 'react';
import './shopreg.css';
import { Alert } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { getToken } from '../../redux/selectors';
import { addToken } from '../../redux/tokenSlice';
import { checkShopAvailabilityQuery } from '../../graphql/queries';
import { registerShopMutation } from '../../graphql/mutations';

class ShopReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop_name: '',
      isAvailable: false,
      message: '',
      isRegistered: false,
      redirectVar: this.props.token ? '' : <Navigate replace to="/login" />,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleShopNameSubmit = this.handleShopNameSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleShopRegSubmit = this.handleShopRegSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name === 'shop_name') {
      this.setState({ shop_name: event.target.value });
    } else {
      this.setState({ message: '' });
    }
  }

  handleValidation() {
    return new Promise((resolve, reject) => {
      let message = '';
      if (this.state.shop_name === '') {
        message = "Shop name can't be empty";
      } else if (this.state.shop_name.length < 4) {
        message = "Shop name can't be less than 4 characters";
      } else if (!this.state.shop_name.match('^[A-Za-z].*')) {
        message = 'Shop name has to start with a character';
      }
      if (message !== '') {
        reject(message);
      } else {
        resolve('No Error');
      }
    });
  }

  handleShopNameSubmit(event) {
    event.preventDefault();
    this.handleValidation()
      .then(() => fetch(process.env.REACT_APP_BACKEND_URL_GRAPHQL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: this.props.token,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: checkShopAvailabilityQuery,
          variables: { shopName: this.state.shop_name },
        }),
      }))
      .then((response) => response.json())
      .then((jsonresp) => {
        if (jsonresp.data.checkShopAvailability) {
          this.setState({
            message: (
              <Alert onClose={this.handleChange}>{jsonresp.data.checkShopAvailability}</Alert>
            ),
            isAvailable: true,
          });
        } else {
          return Promise.reject(jsonresp.errors[0].message);
          // throw new Error(jsonresp.error);
        }
      })
      .catch((error) => {
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

  handleShopRegSubmit(event) {
    event.preventDefault();
    if (this.state.isAvailable) {
      const url = process.env.REACT_APP_BACKEND_URL_GRAPHQL;
      this.handleValidation()
        .then(() => fetch(url, {
          mode: 'cors',
          method: 'POST',
          body: JSON.stringify({
            // shop_name: this.state.shop_name,
            query: registerShopMutation,
            variables: { shopName: this.state.shop_name },
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.props.token,
          },
        }))
        .then((response) => response.json())
        .then((jsonresp) => {
          if (jsonresp.data.registerShop) {
            this.props.addToken(jsonresp.data.registerShop);
            this.setState({
              isRegistered: <Navigate replace to="/shop/home" />,
              isAvailable: true,
            });
          } else {
            console.error('error in json request', jsonresp);
            return Promise.reject(jsonresp.error);
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
    } else {
      this.setState({
        message: (
          <Alert severity="error" onClose={this.handleChange}>
            Shop Name not Available
          </Alert>
        ),
        isAvailable: false,
      });
    }
  }

  render() {
    return (

      <div className="shopreg__parent">
        {this.state.redirectVar}
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
            />
            {' '}
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
export default connect(getToken, { addToken })(ShopReg);
