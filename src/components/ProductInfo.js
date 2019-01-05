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
            async:true,
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
    return (
        <div className="container">
          {this.checkError()}
          {JSON.stringify(this.state.product)}
        </div>
    );
  }
};
