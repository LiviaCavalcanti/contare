import React, { Component } from "react";

import image from "assets/img/sidebar-3.jpg";

import LoginScreen from "views/Login/Login";

class LoginLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown"
    };
  }
  render() {
    return (
      <div className="wrapper">
        <LoginScreen></LoginScreen>
      </div>
    );
  }
}

export default LoginLayout;
