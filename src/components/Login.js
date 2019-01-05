import React,{ Component, Fragment } from 'react';
import $ from 'jquery';
import { getCookie } from './utils'

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: '',
      message: {},
      modelEmail: ''
    }
    $.ajax({
            type: "GET",
            url: "/api/user/signin",
            async:false,
            success: () => {
            },
            error: () => {
            }
        });
    this.onSubmit = this.onSubmit.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.sendMail = this.sendMail.bind(this);
    this._token = getCookie('csrftoken');
  }
  resetPassword = (e) => {
    e.preventDefault();
    $('#resetPassword').modal('hide');
    $.ajax({
            type: "POST",
            url: "user/api/resetpasswordmail",
            dataType: "json",
            data: {
                email: this.state.modelEmail,
                csrfmiddlewaretoken: this._token
            },
            success: (response) => {
                this.setState({message: response.messages});
            },
            error: (e) => {
               this.setState({message: e.responseJSON.messages});
            }
        });
  }
  sendMail = (e) => {
    e.preventDefault();
    $('#confirmation').modal('hide');
    $.ajax({
            type: "POST",
            url: "user/api/sendmail",
            dataType: "json",
            data: {
                email: this.state.modelEmail,
                csrfmiddlewaretoken: this._token
            },
            success: (response) => {
              this.setState({message: response.messages});
            },
            error: (e) => {
               this.setState({message: e.responseJSON.messages});
            }
        });
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit = (e) => {
    e.preventDefault();
    $.ajax({
            type: "POST",
            url: "/api/user/signin",
            dataType: "json",
            data: {
                email: this.state.email,
                password: this.state.password,
                csrfmiddlewaretoken: this._token
            },
            success: (data) => {
              this.props.history.replace('/client/dashboard');
            },
            error: (e) => {
               this.setState({message: e.responseJSON.messages});
            }
        });
  }
  render() {
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
          <div>
            <br/>
            <form method="POST">
              <div className="form-group">
                <input type="email" value={this.state.email} name="email" className="form-control" onChange={this.onChange} placeholder="Enter email"/>
                <input type="password" value={this.state.password} name="password" className="form-control" onChange={this.onChange} placeholder="Enter password"/>
              </div>
              <input hidden type="text" defaultValue={this._token} name="csrfmiddlewaretoken"/>
              {info['messages']}
              <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                <div className="btn-group mr-2" role="group" aria-label="First group">
                  <button onClick={this.onSubmit} type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>
            <br/>
            <div className="btn-group mr-2" role="group" aria-label="Second group">
              <button data-toggle="modal" data-target="#confirmation" className="btn btn-success">Resend Confirmation Mail</button>
              <button data-toggle="modal" data-target="#resetPassword" className="btn btn-info">Reset Password</button>
            </div>
            <div className="modal fade" id="confirmation" tabIndex="-1" role="dialog" aria-labelledby="confirmation" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="confirmationModelLabel">Resend Confirmation Email</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <form method="POST">
                    <div className="modal-body">
                      <input type="email" value={this.state.modelEmail} name="modelEmail" className="form-control" onChange={this.onChange} placeholder="Enter email"/>
                      <input hidden type="text" defaultValue={this._token} name="token"/>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button onClick={this.sendMail} type="submit" className="btn btn-info">Resend Confirmation</button>
                    </div>
                </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="resetPassword" tabIndex="-1" role="dialog" aria-labelledby="confirmation" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="resetPasswordLabel">Reset Password</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <form method="POST">
                    <div className="modal-body">
                      <input type="email" value={this.state.modelEmail} name="modelEmail" className="form-control" onChange={this.onChange} placeholder="Enter email"/>
                      <input hidden type="text" defaultValue={this._token} name="token"/>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button onClick={this.resetPassword} type="submit" className="btn btn-info">Reset Password</button>
                    </div>
                </form>
                </div>
              </div>
            </div>
          </div>
          <br/>
          <a href="/api/user/auth/google" className="button">
            <div>
              <span className="svgIcon t-popup-svg">
                <svg className="svgIcon-use" width="25" height="37" viewBox="0 0 25 25">
                <g fill="none" fillRule="evenodd">
                  <path d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z" fill="#4285F4"/>
                  <path d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z" fill="#34A853"/>
                  <path d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z" fill="#FBBC05"/>
                  <path d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z" fill="#EA4335"/>
                </g>
              </svg>
              </span>
              <span className="button-label">Sign in with Google</span>
            </div>
          </a>
        </div>
    );
  }
};
