/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router';
import { connect } from 'react-redux';
import { addToken } from '../../redux/tokenSlice';
import { addProfile } from '../../redux/profileSlice';
import { getToken } from '../../redux/selectors';
import './login.css';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (props.token) {
      navigate('../home');
    }
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    if (event.target.name === 'email') {
      setEmail(value);
    } else if (event.target.name === 'password') {
      setPassword(value);
    } else {
      setError('');
    }
  };

  const handleValidation = () => {
    let message = '';
    if (email === '') {
      message = 'Email cant be emtpy';
    } else if (email.match('^[A-Za-z0-9.]+@[A-Za-z0-9.-]+$') === null) {
      message = 'Email is not valid, enter valid email';
    } else if (password === '') {
      message = "Password can't be empty";
    } else if (password.length < 4) {
      message = "Password can't be less than 4 characters";
    }
    if (message !== '') {
      setError(message);
      return true;
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!handleValidation()) {
      const url = `${process.env.REACT_APP_BACKEND_URL}users/login`;
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => {
          if (
            response.status === 200
            || response.status === 400
            || response.status === 401
          ) {
            return response.json();
          }
          return Promise.reject({
            error: 'Some error occured during login',
          });
        })
        .then((json) => {
          if (json.token) {
            props.addToken(json.token);
            props.addProfile(json.profile);
            navigate('../home');
          } else {
            return Promise.reject(json.error);
          }
        })
        .catch((promError) => setError(promError));
    }
  };
  return (
    <div className="parent">
      <form className="loginform" onSubmit={handleSubmit}>
        <div className="loginform__heading">Login Here!</div>
        {error && (
          <Alert severity="error" onClose={handleChange}>
            {error}
          </Alert>
        )}
        <div className="loginform__formgroup">
          <label htmlFor="email" className="loginfor__label">
            Email
          </label>
          <input
            type="text"
            className="loginform__input"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="loginform__formgroup">
          <label htmlFor="password" className="loginfor__label">
            Password
          </label>
          <input
            type="password"
            className="loginform__input"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="loginform__formgroupbtn">
          <input
            type="submit"
            className="loginform__submit"
            name="signin"
            value="Sign In"
            disabled={error}
            data-testid="login-button"
          />
          <input
            type="button"
            className="loginform__register"
            name="register"
            value="Register"
            disabled={error}
            onClick={() => navigate('../register')}
          />
        </div>
      </form>
    </div>
  );
}

export default connect(getToken, { addToken, addProfile })(Login);
