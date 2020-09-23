import React, {useState,useEffect} from 'react';
import {getExpense} from '../../services/expenseService';
import {getUserFromID} from '../../services/userService';
import { acceptInviteReq, rejectInviteReq, getAllInvitations} from '../../services/inviteService.js';
import { MenuItem, NavDropdown } from 'react-bootstrap';


var token = localStorage.getItem('token-contare')
export default function Invitation(props) {
    const [invitations,setInvitations] = useState([]);
    const [detailedInvitations, setDetailedInvitations]= useState([])
    const [invitation, setInvitation] = useState({})


    useEffect(()=>{
        getAllInvitations(token, async function(response){
            if(response.length >= 0) {
                setInvitations(response)
            }
        }.bind(this))
    },[])

    useEffect(()=>{
        var tempInvitation={}
        var expTitle = ""
        var owner = ""
        
        if(invitations.length === 0){
            document.getElementById('number').style.visibility='hidden'
        } else{
            document.getElementById('number').style.visibility='visible'

            invitations.map(invite =>{
                getExpense(invite.expense,token).then(response=>{
                    expTitle = response.title;
                    owner = response.participants[0].name
                    tempInvitation=({
                        _id:invite._id,
                        title:expTitle,
                        owner:owner+" ("+response.participants[0].email+")",
                        value:invite.participationValue,
                        totaValue:response.totalValue,
                        descricao:response.description,
                        expense:invite.expense
                    })
                    setInvitation(tempInvitation)
                    setInvitation({})
                })
            })
        }
    },[invitations])
    
    useEffect(()=>{
        
        if(invitation._id !== undefined) detailedInvitations.push(invitation)
        
    },[invitation])

    const notification = (
        <div>
          <i className="fa fa-globe" />
          <b className="caret" />
          <span id="number" className="notification">{detailedInvitations.length}</span>
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
               (detailedInvitations.length > 0) ? detailedInvitations.map(
                    invite=><MenuItem>{invite.title}</MenuItem>):
                     
               <MenuItem>Não há convites</MenuItem>
            }
        </NavDropdown>
    )
}

/*
class Invitation extends Component {
    constructor(props){
        super(props)
        this.loadInvites = this.loadInvites.bind(this)
        this.loadExpenses = this.loadExpenses.bind(this)
        this.acceptInvite = this.acceptInvite.bind(this)
        this.rejectInvite = this.rejectInvite.bind(this)
        this.setNotificationVisible = this.setNotificationVisible.bind(this)
        this.toggleInviteModal = this.toggleInviteModal.bind(this)
        this.getExpenseTitle = this.getExpenseTitle.bind(this)
        
        this.state = {
            invitations: [],
            selectedInvitation:{},
            isOpen:false,
            expense:{}
            }
    }

    loadInvites (){
        const token = localStorage.getItem('token-contare')
        
        getAllInvitations(token, function(response){
            if(response.length >= 0) {
                this.setState({invitations : response})
            }
        }.bind(this));
        
    }
    
    loadExpenses(){
        
        console.log(this.state.invitations)
        const invitationsTemp = this.state.invitations;
        for(let i = 0; i < invitationsTemp.length;i++){

            console.log("AAAA")
            //this.getExpenseTitle(invite.expense)
            console.log(i)
        }
    }

    getExpenseTitle = (expenseID) => {
        console.log(expenseID)
        const token = localStorage.getItem('token-contare')
        getExpense(expenseID,token, function(response) {
            if(response) {
                this.setState({expense:response})
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
        if(this.state.invitations.length === 0){
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
               invite=><MenuItem eventKey={2.1} >{invite._id}</MenuItem>): 
               <MenuItem>Não há convites</MenuItem>
            }
            </NavDropdown>
        )
    }
}

export default withRouter(Invitation);*/