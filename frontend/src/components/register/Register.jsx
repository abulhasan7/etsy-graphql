/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import './register.css';
import { Alert } from '@mui/material';
import { Navigate } from 'react-router';
import { connect } from 'react-redux';
import { getToken } from '../../redux/selectors';
import { addToken } from '../../redux/tokenSlice';
import { addProfile } from '../../redux/profileSlice';
import { registerMutation } from '../../graphql/mutations';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      fullname: '',
      password: '',
      confirmpassword: '',
      message: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    if (event.target.name === 'email') {
      this.setState({ email: value });
    } else if (event.target.name === 'fullname') {
      this.setState({ fullname: value });
    } else if (event.target.name === 'password') {
      this.setState({ password: value });
    } else if (event.target.name === 'confirmpassword') {
      this.setState({ confirmpassword: value });
    } else {
      this.setState({ message: '' });
    }
  }

  handleValidation() {
    let message = '';
    if (this.state.email === '') {
      message = 'Email cant be emtpy';
    } else if (
      this.state.email.match('^[A-Za-z0-9.]+@[A-Za-z0-9.-]+$') === null
    ) {
      message = 'Email is not valid, enter valid email';
    } else if (this.state.fullname === '') {
      message = "Full Name can't be empty";
    } else if (this.state.fullname.length < 4) {
      message = "Full Name can't be less than 4 characters";
    } else if (this.state.password === '') {
      message = "Password can't be empty";
    } else if (this.state.password.length < 4) {
      message = "Password can't be less than 4 characters";
    } else if (this.state.confirmpassword === '') {
      message = "ConfirmPassword can't be empty";
    } else if (this.state.password !== this.state.confirmpassword) {
      message = "Password and Confirm Password don't match";
    }

    if (message !== '') {
      const elem = (
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
      const url = process.env.REACT_APP_BACKEND_URL_GRAPHQL;
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          query: registerMutation,
          variables: {
            email: this.state.email,
            fullname: this.state.fullname,
            password: this.state.password,
          },
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201 || response.status === 400) {
            return response.json();
          }
          return Promise.reject({
            message: 'Some error occured during registration',
          });
        })
        .then((json) => {
          if (!json.data) {
            return Promise.reject(json);
          }
          this.props.addToken(json.data.register.token);
          this.props.addProfile({ fullname: this.state.fullname, email: this.state.email });
          const elem = <Navigate to="/home" />;
          this.setState({ message: elem });
        })
        .catch((error) => {
          console.log(error);
          const elem = (
            <Alert severity="error" onClose={this.handleChange}>
              {error.errors[0].message}
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
          <div className="registerform__heading">Register Here!</div>
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
              data-testid="email-field"
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
          <div className="registerform__formgroupbtn">
            <input
              type="submit"
              className="registerform__btn"
              name="register"
              value="Register Now"
              disabled={this.state.message}
              data-testid="register-button"
            />
            <input
              type="button"
              className="registerform__btn"
              name="login"
              value="Login Instead"
              disabled={this.state.message}
              onClick={() => this.setState({ message: <Navigate to="/login" /> })}
            />
          </div>
        </form>
      </div>
    );
  }
}
export default connect(getToken, { addToken, addProfile })(Register);
