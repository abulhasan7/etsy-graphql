/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-promise-reject-errors */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Alert } from '@mui/material';
import { getTokenAndCurrency } from '../../redux/selectors';
import './shopitemform.css';
import { getParamsForAddItemQuery } from '../../graphql/queries';
import { addItemMutation, updateItemMutation } from '../../graphql/mutations';

class ShopItemForm extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.item || {};
    this.state = {
      item_pic_url: this.item.item_pic_url || '',
      item_pic_file: this.item.item_pic_file || '',
      category: this.item.category || 'Select',
      description: this.item.description || '',
      price: this.item.price || 0.0,
      stock: this.item.stock || 0,
      itemname: this.item.name || '',
      categories: [],
      s3_upload_url: '',
      alert: '',
      manualcategory: '',
      _id: this.item._id,
      itemChanged: false,
    };
    Modal.setAppElement('#root');
    this.customStyles = {
      content: {
        top: '10%',
        left: '20%',
        right: '20%',
        bottom: '15%',
      },
    };
    this.handleModelClose = this.handleModelClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputValidation = this.handleInputValidation.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_BACKEND_URL_GRAPHQL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: this.props.token,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: getParamsForAddItemQuery,
      }),
    })
      .then((response) => response.json())
      .then((jsonresponse) => {
        this.setState({
          s3_upload_url: jsonresponse.data.getParamsForAddItem.s3_upload_url,
          categories: jsonresponse.data.getParamsForAddItem.categories.categories,
        });
      });
  }

  handleModelClose() {
    console.log(this.state.itemChanged);
    this.props.handleModelClose(this.state.itemChanged);
  }

  handleInputChange(event) {
    if (event.target.name === 'file') {
      const url = URL.createObjectURL(event.target.files[0]);
      this.setState({
        item_pic_url: url,
        item_pic_file: event.target.files[0],
      });
    } else if (event.target.name === 'itemname') {
      this.setState({ itemname: event.target.value });
    } else if (event.target.name === 'description') {
      this.setState({ description: event.target.value });
    } else if (event.target.name === 'price') {
      this.setState({ price: event.target.value });
    } else if (event.target.name === 'stock') {
      this.setState({ stock: event.target.value });
    } else if (
      event.target.name === 'category'
      && event.target.value === 'Create Category'
    ) {
      this.setState({
        category: 'Create Category',
        manualcategory: 'Create Category Here',
      });
    } else if (event.target.name === 'category') {
      this.setState({ category: event.target.value, manualcategory: '' });
    } else if (event.target.name === 'manualcategory') {
      this.setState({ manualcategory: event.target.value });
    } else {
      this.setState({ alert: '' });
    }
  }

  handleInputValidation() {
    return new Promise((resolve, reject) => {
      let message = '';
      if (this.state.item_pic_url === '' && this.state.item_pic_file === '') {
        message = "Item picture can't be empty";
      } else if (
        this.state.item_pic_file
        && !this.state.item_pic_file.type.startsWith('image')
      ) {
        message = 'Item picture has to be an image file only';
      } else if (this.state.itemname === '') {
        message = "Item Name can't be empty";
      } else if (this.state.itemname.length < 5) {
        message = "Item Name can't be less than 5 characters";
      } else if (this.state.description.length < 10) {
        message = "Description can't be less than 10 characters";
      } else if (this.state.price === '') {
        message = "Price can't be empty";
      } else if (!(`${this.state.price}`).match('^\\d{1,}.\\d{2}$')) {
        message = 'Price has to be in Dollars.Cents format';
      } else if (this.state.stock < 1) {
        message = "Stock can't be less than 1";
      } else if (this.state.category === 'Select') {
        message = "Category can't be empty";
      }

      if (message !== '') {
        reject(message);
      }
      resolve(true);
    });
  }

  handleInputSubmit(event) {
    event.preventDefault();
    this.handleInputValidation()
      .then(() => {
        if (this.state.item_pic_file) {
          return fetch(this.state.s3_upload_url, {
            method: 'PUT',
            body: this.state.item_pic_file,
          });
        }
      })
      .then((s3response) => {
        if (s3response && s3response.status !== 200) {
          return Promise.reject({
            message: 'Error occurred during uploading file',
          });
        } if (s3response && s3response.status === 200) {
          return Promise.resolve(this.state.s3_upload_url.split('?')[0]);
        }
        return Promise.resolve(this.state.item_pic_url);
      })
      .then((itemUrl) => fetch(process.env.REACT_APP_BACKEND_URL_GRAPHQL, {
        method: 'POST',
        body: JSON.stringify({
          query: !this.props.item._id
            ? addItemMutation : updateItemMutation,
          variables: {
            item_pic_url: itemUrl,
            category: this.state.manualcategory || this.state.category,
            description: this.state.description,
            price: parseFloat(this.state.price).toFixed(2),
            stock: parseInt(this.state.stock, 10),
            name: this.state.itemname,
            item_id: this.state._id,
          },
        }),
        headers: {
          Authorization: this.props.token,
          'Content-type': 'application/json',
        },
      }))
      .then((response) => response.json())
      .then((response) => {
        if (!response.errors) {
          const elem = (
            <Alert onClose={this.handleModelClose}>
              {response.data.addItem || response.data.updateItem || 'Success'}
            </Alert>
          );
          this.setState({ alert: elem, itemChanged: true });
        } else {
          return Promise.reject(response.errors[0].message);
        }
      })
      .catch((error) => {
        const elem = (
          <Alert severity="error" onClose={this.handleInputChange}>
            {error.message || error}
          </Alert>
        );
        this.setState({ alert: elem });
      });
  }

  render() {
    return (
      <Modal
        isOpen="true"
        style={this.customStyles}
        contentLabel="Example Modal"
      >
        <form className="shopitemform" onSubmit={this.handleInputSubmit}>
          <div className="shopitemform__heading">Add/Edit Item</div>
          {this.state.alert}
          <div className="shopitemform__formmessage">{this.state.message}</div>
          <div className="shopitemform__formimagegrid">
            <img
              src={
                this.state.item_pic_url
                || 'https://d3a1v57rabk2hm.cloudfront.net/callnumber/betterman_mobile-copy-0/images/product_placeholder.jpg?ts=1581594912&host=call-number.cratejoy.com'
              }
              className="shopitemform__formimage"
              alt="item-pic"
            />
          </div>
          <div className="shopitemform__formgroup">
            <label htmlFor="shopformpic">Item Picture</label>
            <input
              type="file"
              name="file"
              id="shopformpic"
              className="shopitemform__pic shopitemform__formcontrol"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="shopitemform__formgroup">
            <label htmlFor="itemname">Item Name</label>
            <input
              type="text"
              id="itemname"
              name="itemname"
              className="shopitemform__formcontrol"
              value={this.state.itemname}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="shopitemform__formgroup">
            <label htmlFor="iformdescription">Description</label>
            <textarea
              name="description"
              id="iformdescription"
              className="shopitemform__formcontrol"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="shopitemform__formgroup">
            <label htmlFor="price">
              Price(
              {this.props.currency}
              ):
            </label>

            <input
              type="number"
              name="price"
              id="price"
              className="shopitemform__formcontrol"
              value={this.state.price}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="shopitemform__formgroup">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              name="stock"
              id="stock"
              className="shopitemform__formcontrol"
              value={this.state.stock}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="shopitemform__formgroup">
            <label htmlFor="category">Category</label>

            <select
              name="category"
              id="category"
              className="shopitemform__formcontrol"
              value={this.state.category}
              onChange={this.handleInputChange}
            >
              <option>Select</option>
              {this.state.categories.map((category) => <option>{category}</option>)}
              <option>Create Category</option>
            </select>
          </div>
          {this.state.manualcategory && (
            <div className="shopitemform__formgroup">
              <label htmlFor="manualcategory">Category Name:</label>
              <input
                name="manualcategory"
                id="manualcategory"
                className="shopitemform__formcontrol"
                value={this.state.manualcategory}
                onChange={this.handleInputChange}
              />
            </div>
          )}
          <div className="shopitemform__formbuttoncontrol">
            <input type="button" onClick={this.handleModelClose} className="btn" value="Close" />
            <input type="submit" value="Save" className="btn" />
          </div>
        </form>
      </Modal>
    );
  }
}
export default connect(getTokenAndCurrency, null)(ShopItemForm);
