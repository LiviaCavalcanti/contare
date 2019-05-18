import React, {Component} from 'react'
import './userProfileComponent.css'

class UserProfile extends Component {
    render() {
        return (
            <h1>{this.props.user.name}</h1>
        )
    }
}

export default UserProfile