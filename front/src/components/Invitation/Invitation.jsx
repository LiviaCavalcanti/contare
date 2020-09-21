import React, {Component} from 'react';
import {getExpense} from '../../services/expenseService';
import {getUserFromID} from '../../services/userService';
import { acceptInviteReq, rejectInviteReq, getAllInvitations} from '../../services/inviteService.js';
import {withRouter} from 'react-router';
import { MenuItem, NavDropdown } from 'react-bootstrap';

class Invitation extends Component {
    constructor(props){
        super(props)
        this.loadInvites = this.loadInvites.bind(this)
        this.getExpenseTitle = this.getExpenseTitle.bind(this)
        this.getUserName = this.getUserName.bind(this)
        this.acceptInvite = this.acceptInvite.bind(this)
        this.rejectInvite = this.rejectInvite.bind(this)
        this.setNotificationVisible = this.setNotificationVisible.bind(this)
        this.toggleInviteModal = this.toggleInviteModal.bind(this)

        this.state = {
            invitations: [],
            selectedInvitation:{},
            isOpen:false,
            }
    }

    loadInvites = () => {
        const token = localStorage.getItem('token-contare')
        
        getAllInvitations(token, function(response){
            if(response.length >= 0) {
                this.setState({invitations: response})
                
                this.state.invitations.map(invite =>{
                    this.getExpenseTitle(invite.expense);
                })


            } else {
                this.props.history.push("/");
                
            }
        }.bind(this));
    }

    componentWillMount() {
        this.loadInvites()
    }

    getExpenseTitle = (expenseID) => {
    getExpense(expenseID, function(response) {
        if(response) {
            let invitationsClone = this.state.invitations.slice(0)

            invitationsClone.map(invite =>{
                if(invite.expense === expenseID) {
                    invite.expense = {
                        expenseID,
                        expenseTitle: response.title
                    }
                }
            })

            this.setState({invitations: invitationsClone})
        }

    }.bind(this))
    }

    getUserName = (userID) => {
        const token = localStorage.getItem('token-contare')
    getUserFromID(userID, token, function(response){
        let invitationsClone = this.state.invitations.slice(0)

        invitationsClone.map(invite =>{
            if(invite.from === userID) {
                invite.from = {
                    fromID: userID,
                    fromName: response.name
                }
            }
        })

        this.setState({invitations: invitationsClone})
        
    }.bind(this)) 
    }

    acceptInvite = (inviteID) => {
        const token = localStorage.getItem('token-contare')
        acceptInviteReq(inviteID, token)
        this.loadInvites()
    }

    rejectInvite = async (inviteID) => {
        const token = localStorage.getItem('token-contare')
        await rejectInviteReq(inviteID, token)

        this.loadInvites()
    }

    setNotificationVisible(){
        if(this.state.invitations.length == 0){
            document.getElementById("number").style.visibility = 'hidden';
        }else{
            document.getElementById("number").style.visibility = 'visible';
        }
    }

    toggleInviteModal(){
        this.setState({isOpen:!this.state.isOpen})
    }

    componentDidMount(){
        this.loadInvites();
        this.setNotificationVisible();
        console.log('CONVITES')
        console.log(this.state.invitations)
    }
    

    render(){
        
        const notification = (
            <div>
              <i className="fa fa-globe" />
              <b className="caret" />
              <span id="number" className="notification">{this.state.invitations.length}</span>
              <p className="hidden-lg hidden-md">Notification</p>
            </div>
          );

        return(

            <NavDropdown
                eventKey={2}
                title={notification}
                noCaret
                id="basic-nav-dropdown"
                action={false}
                onToggle={false}
            >
            {
               (this.state.invitations.length > 0) ? this.state.invitations.map(
                   invite=><MenuItem eventKey={2.1} >{invite.title}</MenuItem>): 
               <MenuItem>Não há convites</MenuItem>
            }
            </NavDropdown>
        )
    }
}

export default withRouter(Invitation);