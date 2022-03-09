import React, { Component } from "react";
import "./profile.css";
import { Alert } from "@mui/material";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_pic_url: "",
      profile_pic_file:"",
      fullname: "",
      gender: "",
      address_1: "",
      address_2: "",
      city: "",
      dob: "",
      about: "",
      phone: "",
      country: "Africa",
      message: "",
      listcountries: ["India", "Africa"],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  componentDidMount() {
    let url = "http://localhost:3001/users/get";
    fetch(url, {
      mode: "cors",
      //no header, as we want fetch to set the header itself, if we set then we hve to define boundary
    })
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          return response.json();
        } else {
          return Promise.reject({
            message: "Some error occured during getting user details",
          });
        }
      })
      .then((json) => {
        if (json.error) {
          return Promise.reject(json);
        } else {
          json = json.message;
          let currentState = {
            profile_pic_url: json.profile_pic_url,
            fullname: json.fullname,
            gender: json.gender,
            address_1: json.address_1,
            address_2: json.address_2,
            city: json.city,
            dob: json.dob,
            about: json.about,
            phone: json.phone,
            country: json.country,
          };
          this.setState(currentState);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  handleChange(event) {
    if (event.target.name === "file") {
      let fr = new FileReader();
      fr.onload = ()=> {console.log("fr is ",fr);this.setState({profile_pic_url:fr.result,profile_pic_file: event.target.files[0]})};
      fr.readAsDataURL(event.target.files[0]);
    } else if (event.target.name === "fullname") {
      this.setState({ fullname: event.target.value });
    } else if (event.target.id === "profileform__gender_male") {
      this.setState({ gender: "M" });
    } else if (event.target.id === "profileform__gender_female") {
      this.setState({ gender: "F" });
    } else if (event.target.name === "address_1") {
      this.setState({ address_1: event.target.value });
    } else if (event.target.name === "address_2") {
      this.setState({ address_2: event.target.value });
    } else if (event.target.name === "city") {
      this.setState({ city: event.target.value });
    } else if (event.target.name === "dob") {
      this.setState({ dob: event.target.value });
    } else if (event.target.name === "about") {
      this.setState({ about: event.target.value });
    } else if (event.target.name === "phone") {
      this.setState({ phone: event.target.value });
    } else if (event.target.name === "country") {
      this.setState({ country: event.target.value });
    } else {
      this.setState({ message: "" });
    }
  }

  handleValidation() {
    return new Promise((resolve, reject) => {
      let message = "";
      if (this.state.profile_pic_url === "" && this.state.profile_pic_file =="") {
        message = "Profile picture can't be empty";
      } else if ( this.state.profile_pic_file && !this.state.profile_pic_file.type.startsWith("image")) {
        console.log(this.state.profile_pic_file.type);
        message = "Profile picture has to be an image file only";
      } else if (this.state.fullname === "") {
        message = "Full Name can't be empty";
      } else if (this.state.fullname.length < 8) {
        message = "Full Name can't be less than 8 characters";
      } else if (this.state.gender === "") {
        message = "Gender can't be empty";
      } else if (this.state.address_1 === "") {
        message = "Street Address can't be empty";
      } else if (this.state.address_1 === "") {
        message = "Street Address can't be less than 8 characters";
      } else if (this.state.address_2 === "") {
        message = "Apartment No can't be empty";
      } else if (this.state.city === "") {
        message = "City can't be empty";
      } else if (this.state.city.length < 3) {
        message = "City can't be less than 3 characters";
      } else if (this.state.dob === "") {
        message = "Date of Birth can't be empty";
      } else if (this.state.about === "") {
        message = "About can't be empty";
      } else if (this.state.about.length < 10) {
        message = "About can't be less than 10 characters";
      } else if (this.state.phone === "") {
        message = "Phone can't be empty";
      } else if (this.state.phone.length !== 10) {
        message = "Phone has to be 10 numbers exact";
      } else if (this.state.country === "") {
        message = "Country can't be empty";
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
        let url = "http://localhost:3001/users/update";
        const form = {
          fullname: this.state.fullname,
          gender: this.state.gender,
          address_1: this.state.address_1,
          address_2: this.state.address_2,
          city: this.state.city,
          dob: this.state.dob,
          about: this.state.about,
          phone: this.state.phone,
          country: this.state.country,
        };
        const formdata = new FormData();
        if(this.state.profile_pic_file){
          formdata.append("profile_pic_file", this.state.profile_pic_file);
        }
        formdata.append("form", JSON.stringify(form));
        fetch(url, {
          method: "PUT",
          mode: "cors",
          body: formdata,
          //no header, as we want fetch to set the header itself, if we set then we hve to define boundary
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
              let elem = (
                <Alert onClose={this.handleChange}>{json.message}</Alert>
              );
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
      })
      .catch((error) => {
        console.log("error occured during update", error);
        if (!this.state.message) {
          let elem = (
            <Alert severity="error" onClose={this.handleChange}>
              {"Some error occurred during update"}
            </Alert>
          );
          this.setState({ message: elem });
        }
      });
  }

  render() {
    console.log("file", this.state.pic);
    return (
      <div className="profileform__parent">
      <form className="profileform" onSubmit={this.handleSubmit}>
        <div className="profileform__heading">Your Public Profile</div>
        <div className="profileform__formmessage">{this.state.message}</div>
        <div className="profileform__formimagegrid">
        <img src={this.state.profile_pic_url} className="profileform__formimage"></img>
      </div>
        <div className="profileform__formgroup">
          <label htmlFor="file">Profile Picture</label>
          <input
            type="file"
            name="file"
            className="profileform__pic profileform__formcontrol"
            onChange={this.handleChange}
          ></input>
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="profileform__formcontrol"
            value={this.state.fullname}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label>Gender:</label>
          <span>
            <label htmlFor="male">Male:</label>
            <input
              type="radio"
              name="gender"
              id="profileform__gender_male"
              className="profileform__formcontrol"
              checked={this.state.gender === "M"}
              onChange={this.handleChange}
            />
            <label htmlFor="female">FeMale:</label>
            <input
              type="radio"
              name="gender"
              id="profileform__gender_female"
              className="profileform__formcontrol"
              checked={this.state.gender === "F"}
              onChange={this.handleChange}
            />
          </span>
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="address_1">Street Address:</label>

          <input
            type="text"
            name="address_1"
            id="address_1"
            className="profileform__formcontrol"
            value={this.state.address_1}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="address_2">Apartment No:</label>
          <input
            type="text"
            name="address_2"
            id="address_2"
            className="profileform__formcontrol"
            value={this.state.address_2}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="city">City</label>

          <input
            type="text"
            name="city"
            id="city"
            className="profileform__formcontrol"
            value={this.state.city}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="dob">Date of Birth:</label>

          <input
            type="date"
            name="dob"
            id="dob"
            className="profileform__formcontrol"
            value={this.state.dob}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="about">About</label>

          <textarea
            name="about"
            id="about"
            className="profileform__formcontrol"
            value={this.state.about}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="phone">Phone</label>

          <input
            type="number"
            id="phone"
            name="phone"
            className="profileform__formcontrol"
            value={this.state.phone}
            onChange={this.handleChange}
          />
        </div>
        <div className="profileform__formgroup">
          <label htmlFor="country">Country</label>

          <select
            name="country"
            id="country"
            className="profileform__formcontrol"
            value={this.state.country}
            onChange={this.handleChange}
          >
            {this.state.listcountries.map((country) => {
              return <option>{country}</option>;
            })}
          </select>
        </div>
        <div className="profileform__formbuttoncontrol">
        <input
          type="submit"
          name="update"
          value="Update Profile"
          className="profileform__formbutton"
        />
        </div>
      </form>
      </div>
    );
  }
}
