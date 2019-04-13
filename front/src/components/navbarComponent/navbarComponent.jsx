import React, { Component } from 'react';
import './navbarComponent.css';

class NavbarComponent extends Component {
    // constructor(props) {
    //     super(props);
    // }

    signUp(){
        console.log("Sign Up");
    }
    
    signIn(){
        console.log("Sign In");
    }

    render() {
        return (
            <div className="navbar">
                <h1>Contare</h1>
                <div className="div-button">
                    <button type="button" onClick={this.signUp}>Sign up</button>
                    <button type="button" onClick={this.signIn}>Sign in</button>
                </div>
            </div>
        )
    }
}

export default NavbarComponent;
