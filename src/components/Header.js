import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Cart  from './Cart';
class Header extends Component {
  render() {
    return (
        <div>
          <nav style={{backgroundColor:"#563D7C"}} className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/client"><i className="fa fa-shopping-basket"></i>  Dzone</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/client">Home <span className="sr-only">(current)</span></Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      User  <i className="fa fa-user-circle"></i> <span className="caret"></span>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <Link className="dropdown-item" to="/client/dashboard">Profile Page</Link>
                      <a className="dropdown-item" href="/api/user/logout">Log Out</a>
                      <Link className="dropdown-item" to="/client/user/signin">SignIn</Link>
                      <Link className="dropdown-item" to="/client/user/signup">SignUP</Link>
                    </div>
                  </li>
                  <Cart cart={this.props.cart}></Cart>
                </ul>
              </div>
            </div>
          </nav>
        </div>
    );
  }
};

Header.propTypes = {
    cart: PropTypes.object.isRequired,
};

export default Header;
