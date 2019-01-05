import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import Client from './components/Client';
import UpdateCart from './components/UpdateCart';
import { ProductInfo } from './components/ProductInfo';
import { getCookie, stringToObject } from './components/utils';
import './assets/css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    if(getCookie('cart')) {
      this.state = {
        cart : stringToObject(getCookie('cart'))
      }
    } else {
      this.state = {
        cart: {
          "products": {},
          "total_price":0.00
        }
      }
    }
    this.updateCart = this.updateCart.bind(this);
  }
  updateCart(cart) {
    this.setState({
      cart: cart
    })
  }
  render() {
    return (
      <div>
        <Header cart={this.state.cart}></Header>
        <Switch>
            <Route exact path = '/client/user/signup' component = {Signup} />
            <Route exact path = '/client' render={()=><Client updateCart={this.updateCart}/>} />
            <Route exact path = '/client/cart' render={()=><UpdateCart cart={this.state.cart}/>} />
            <Route exact path = '/client/user/signin' component = {Login} />
            <Route exact path = '/client/dashboard' component = {Dashboard} />
            <Route exact path = '/client/productinfo/:id' component = {ProductInfo} />
        </Switch>
      </div>
    );
  }
}

export default App;
