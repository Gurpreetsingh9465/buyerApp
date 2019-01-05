import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { getCookie }  from './utils'
import PropTypes from 'prop-types';

class Cart extends React.Component {
  constructor(props) {
    super(props);
    var count = 0;
    for( let i in props.cart["products"]) {
      count += props.cart["products"][i]["quantity"];
    }
    this.state = {
      count: count
    }
  }
  componentWillReceiveProps(newProps) {
    var count = 0;
    for( let i in newProps.cart["products"]) {
      count += newProps.cart["products"][i]["quantity"];
    }
    this.setState({
      count: count
    })
  }
  render() {
    console.log(this.props.cart);
    return (
        <li style={{alignItems: "flex-end"}} className="nav-item">
          <Link className="nav-link" to="/client/cart">Cart <span className="badge badge-light">{this.state.count}</span><span className="sr-only">(current)</span></Link>
        </li>
    );
  }
};

Cart.propTypes = {
    cart: PropTypes.object.isRequired,
};

export default Cart;
