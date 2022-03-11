import { Navigate } from "react-router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getToken } from "../../redux/selectors";
import "./shophome.css";

class ShopHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop_pic_url: "",
      shop_pic_file: "",
      shop_name: "",
      total_sales: "",
      user:{
          profile_pic_url:"",
          fullname:"",
          phone:""
      },
      redirectVar:""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  componentDidMount() {
    let url = "http://localhost:3001/shops/get";
    fetch(url, { credentials: "include", mode: "cors",headers:{'Authorization':this.props.token} })
    .then(response=>response.json())
    .then(jsonresponse=>{
      console.log(jsonresponse)
        if(jsonresponse.error){
          let redirectVar = <Navigate replace to="/shop/register" ></Navigate>
          this.setState({redirectVar:redirectVar})
        }else{
          console.log(jsonresponse);
          this.setState({
              shop_name:jsonresponse.shop_name,
              shop_pic_url:jsonresponse.shop_pic_url,
              user:jsonresponse.user
          });
        }

    })
    .catch(error=>console.log(error))
}

  handleChange(event) {}

  handleValidation(event) {}

  handleSubmit(submit) {}
  render() {
    return (
            <form className="shopform">
              {this.state.redirectVar}
                <div className="shopform__child1">
                    <img src={this.state.shop_pic_url} className="shopform__image"/>
                    <div>
                    <input type='file' className="shopform__button"/>
                    </div>
                </div>
                <div className="shopform__child2">
                    <span className="shopform__title">{this.state.shop_name}</span>
                    <div>
                    <input type='button' value={'Edit Shop'} className="shopform__button"/>
                    </div>
                </div>
                <div className="shopform__child3">
                <div>Shop Owner</div>
                <img src={this.state.user.profile_pic_url} className="shopform__image"/>
                <div>Owner Name: {this.state.user.fullname}</div>
                <div>Contact: {this.state.user.phone}</div>
                </div>
            </form>
    )
  }
}
export default connect(getToken, null)(ShopHome);
