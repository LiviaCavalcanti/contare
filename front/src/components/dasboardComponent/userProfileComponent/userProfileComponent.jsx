import React, {Component} from 'react'
import './userProfileComponent.css'
import avatar from '../../../images/avatar.jpg'

class UserProfile extends Component {
    render() {
        return (
            <div className="userInfo">
            <img alt="" src={avatar} className="avatarImage" />
            <p>Bem Vindo, {this.props.user.name}</p>

            </div>
        )
    }
}

export default UserProfile