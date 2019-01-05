import React,{ Component,Fragment } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { getCookie,stringToObject }  from './utils'
import PropTypes from 'prop-types';

class UpdateCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: props.cart,
      message: {}
    }
    $.ajax({
            type: "GET",
            url: "/api/order",
            async:false,
            success: () => {

            },
            error: () => {
               alert('error');
            }
        });
      this.checkout = this.checkout.bind(this);
  }
  checkout = (e) => {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/api/order",
        dataType: "json",
        data: {
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        success: (response) => {
          this.setState({message: response.messages});
        },
        error: (e) => {
          if(e.responseJSON) {
            this.setState({
              message: e.responseJSON.messages,
              cart: stringToObject(getCookie('cart'))
          });
          } else {
            this.setState({message: {danger: 'Something Went Wrong'}});
          }
        }
      });
  }
  pushProduct = (id,product,products) => {
    var html = (
      <tbody key={'key-' + id}>
        <tr>
          <td data-th="Product">
            <div className="row">
              <div className="col-sm-2 hidden-xs"><img style={{maxHeight:"200px",maxWidth:"90px"}} src={product.image} alt="..." className="img-responsive"/></div>
              <div className="col-sm-10">
                <h4 className="nomargin">{product.name}</h4>
              </div>
            </div>
          </td>
          <td data-th="Quantity">
            <input type="number" className="form-control text-center" value={product.quantity}/>
          </td>
          <td data-th="Subtotal" className="text-center">{product.price}</td>
          <td className="actions" data-th="">
            <button className="btn btn-info btn-sm"><i className="fa fa-refresh"></i></button>
            <button className="btn btn-danger btn-sm"><i className="fa fa-trash-o"></i></button>
          </td>
        </tr>
      </tbody>
    )
    products.push((id,html));
  }
  render() {
    var products = [];
    for (let [key, value] of Object.entries(this.state.cart.products)) {
        this.pushProduct(key,value,products)
    }
    let info = '';
    if( !(Object.keys(this.state.message).length === 0) ) {
      var type = Object.keys(this.state.message)[0];
      info = {
        messages: (
          <Fragment>
            <div className={"alert alert-"+type}>
              <strong>{this.state.message[type]}</strong>
            </div>
          </Fragment>
        )
      }
    }
    return (
        <div className="container">
          <table id="cart" className="table table-hover table-condensed">
      				<thead>
  						<tr>
  							<th style={{ width:"60%" }}>Product</th>
  							<th style={{ width:"8%" }}>Quantity</th>
  							<th style={{ width:"22%" }} className="text-center">Subtotal</th>
  							<th style={{ width:"10%" }}></th>
  						</tr>
  					</thead>
            {products}
  					<tfoot>
  						<tr className="visible-xs">
  							<td className="text-center"><strong>Total <i className="fa fa-inr"></i>{this.state.cart.total_price}</strong></td>
  						</tr>
  						<tr>
  							<td><Link to="/client" className="btn btn-warning"><i className="fa fa-angle-left"></i> Continue Shopping</Link></td>
  							<td colSpan="2" className="hidden-xs"></td>
  							<td className="hidden-xs text-center"><strong>Total <i className="fa fa-inr"></i>{this.state.cart.total_price}</strong></td>
  							<td><button onClick={this.checkout} className="btn btn-success btn-block">Checkout <i className="fa fa-angle-right"></i></button></td>
  						</tr>
  					</tfoot>
  				</table>
          {info['messages']}
        </div>
    );
  }
};

UpdateCart.propTypes = {
    cart: PropTypes.object.isRequired,
};

export default UpdateCart;
