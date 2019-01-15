import React, { Component } from 'react';
import $ from 'jquery'
import { Link } from 'react-router-dom';
export class ProductInfo extends Component {
  constructor(props) {
    super(props);
    this.error = false;
    this.prodCount = 0;
    this.state = {
      product: {}
    };
  }
  componentWillMount() {
    const {id} = this.props.match.params;
    $.ajax({
            type: "GET",
            url: "/api/productinfo?pid="+id,
            async: false,
            success: (data) => {
              this.setState({
                product: data.products
              })
            },
            error: () => {
              this.error = true;
            }
        });
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
    const test = Object.keys(this.state.product);

    var features = []
    for( let i in this.state.product[test[0]].features) {
      var totalWords =  this.state.product[test[0]].features[i];
      var firstWord = totalWords.replace(/ .*/,'');
      features.push(
        <span key={'features-'+i+'-'+ test[0]}>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{firstWord}</h5>
              </div>
          <p className="mb-1">{this.state.product[test[0]].features[i]}</p>
        </a>
        </span>
      );
    }


    return (
        <div>
          {this.checkError()}
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">{this.state.product[test[0]].name}</h1>
                <p className="lead">{this.state.product[test[0]].description}</p>
            </div>
          </div>
          <div className="container">
            <div className="row">

              <div className="col-lg-6 col-sm-11 mx-auto">
                <div className="text-left margin">
                  <ul className="productImage paddingZero">
                  </ul>
                </div>
                <div className="thumbnail">
                  <img src={this.state.product[test[0]].images[0]} className="img-responsive rounded mx-auto d-block" alt="Iphone X" />
                </div>
              </div>
              <div className="col-lg-6 col-sm-11 mx-auto">
                <div className="container padding">
                  <div className="col">
                    <div className="row">
                      <div className="col mini-box">
                        <div className="padding col mini-box">
                          <span>M.R.P: ₹ </span><p className="line-through">{this.state.product[test[0]].original_price}</p>
                          <p>Our Price: ₹ {this.state.product[test[0]].discounted_price}</p>
                        </div>
                      </div>
                      <div className="padding col mini-box">
                        <button type="button" name="button" className="col btn btn-warning">Add to Cart <i className="fa fa-shopping-cart"></i></button>
                      </div>
                    </div>
                  </div>
                  <div className="list-group">
                    {features}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
};
