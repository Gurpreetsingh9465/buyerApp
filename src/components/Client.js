import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { getCookie, stringToObject } from './utils';
import PropTypes from 'prop-types';


class Client extends Component {
  constructor(props) {
    super(props);
    this.error = false;
    this.prodCount = 0;
    $.ajax({
            type: "GET",
            url: "/api/add",
            async:false
        });
    this.state = {
      products: {}
    };
  }
  componentWillMount() {
    $.ajax({
            type: "GET",
            url: "/api/products/",
            async:true,
            success: (data) => {
              this.setState({
                products: data.products
              })
            },
            error: () => {
              this.error = true;
            }
        });
  }
  addProduct = (id) =>  {
    $.ajax({
            type: "POST",
            url: "/api/add",
            async:true,
            dataType: "json",
            data: {
                pid:id,
                quant:1,
                csrfmiddlewaretoken: getCookie('csrftoken')
            },
            success : ()=>{
              this.props.updateCart(stringToObject(getCookie('cart')));
            }
        });
  }
  pushProduct = (id,product,products) => {
    var features = []
    for( let i in product.features) {
      features.push(<li key={'features-'+i+'-'+ id} ><i className="fa fa-chevron-circle-right"></i>{product.features[i]}</li>);
    }
    var html = (
      <div key={'key-' + id} className="row">
        <div className="card col-sm-12">
          <div className="row">
            <div className="col-sm-2 col-xs-8">
              <img className="card-img-top" src={product.image} />
            </div>
            <div className="col-sm-6 col-xs-10 pull-left">
              <h2>{product.name}</h2>
                <ul className="fa-ul">
                  {features}
                </ul>
            </div>
            <div className="col-sm-2 col-xs-2 ">
              <br/>
              <p style={{textDecoration: "line-through"}}><i className="fa fa-inr"></i> {product.original_price}</p>
              <p><i className="fa fa-inr"></i> {product.discounted_price}</p>
              <Link style={{borderRadius: "10px"}} className="btn btn-primary" to={"/client/productinfo/"+id}><i className="fa fa-info"></i> More Info</Link>
              <br/>
              <br/>
              <button className="btn btn-warning" style={{borderRadius: "10px"}} onClick={this.addProduct.bind(this, id)} ><i className="fa fa-shopping-cart"></i> Add To Cart!</button>
            </div>
          </div>
        </div>
      </div>
    )
    products.push((id,html));
  }
  checkError = () => {
    if(this.error) {
      return (
      <div className={"alert alert-danger"}>
        <strong>Nothing To Show</strong>
      </div>);
    }
    return '';
  }
  render() {
    var products = [];
    for (let [key, value] of Object.entries(this.state.products)) {
        this.pushProduct(key,value,products)
    }
    return (
        <div className="container">
          {products}
          {this.checkError()}
        </div>
    );
  }
};


Client.propTypes = {
    updateCart: PropTypes.func,
};

export default Client;
