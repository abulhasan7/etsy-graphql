import React, {useState,useEffect } from "react";
import "./login.css";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router";
import { connect } from "react-redux";
import { addToken } from "../../redux/tokenSlice";
import { getToken } from "../../redux/selectors";


function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (props.token) {
      navigate("../home");
    }
  }, []);

  const handleChange = (event) => {
    let value = event.target.value;
    if (event.target.name === "email") {
      setEmail(value);
    } else if (event.target.name === "password") {
      setPassword(value);
    } else {
      setError("");
    }
  };

  const handleValidation = () => {
    let message = "";
    if (email === "") {
      message = "Email cant be emtpy";
    } else if (email.match("^[A-Za-z0-9.]+@[A-Za-z0-9.-]+$") === null) {
      message = "Email is not valid, enter valid email";
    } else if (password === "") {
      message = "Password can't be empty";
    } else if (password.length < 8) {
      message = "Password can't be less than 8 characters";
    }
    if (message !== "") {
      setError(message);
      return true;
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!handleValidation()) {
      let url = "http://localhost:3001/users/login";
      fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => {
          if (
            response.status === 200 ||
            response.status === 400 ||
            response.status === 401
          ) {
            return response.json();
          } else {
            return Promise.reject({
              error: "Some error occured during login",
            });
          }
        })
        .then((json) => {
          if (json.token) {
            props.addToken(json.token);
            localStorage.setItem("token", json.token);
            navigate("../home");
          } else {
            return Promise.reject(json.error);
          }
        })
        .catch((error) => setError(error));
    }
  };
  return (
    <div className="parent">
      <form className="loginform" onSubmit={handleSubmit}>
        <div className="loginform__heading">Etsy!</div>
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
            value={"Sign In"}
            disabled={error}
          />
            <input
            type="button"
            className="loginform__register"
            name="register"
            value={"Register"}
            disabled={error}
            onClick= {()=>navigate("../register")}
          />
        </div>
      </form>
    </div>
  );
}

export default connect(getToken, { addToken })(Login);
