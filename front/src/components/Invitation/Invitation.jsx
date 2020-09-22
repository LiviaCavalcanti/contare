import React, {useState,useEffect} from 'react';
import {getExpense} from '../../services/expenseService';
import {getUserFromID} from '../../services/userService';
import { acceptInviteReq, rejectInviteReq, getAllInvitations} from '../../services/inviteService.js';
import { MenuItem, NavDropdown } from 'react-bootstrap';


var token = localStorage.getItem('token-contare')
export default function Invitation(props) {
    const [invitations,setInvitations] = useState([]);
    const [detailedInvitations, setDetailedInvitations]= useState([])
    const [selectedExpense, setSelectedExpense] = useState({})

    async function getInvitations(){
        await   getAllInvitations(token).then((response)=>{
                    setInvitations(response)
                    console.log(response)
                })
    }

    async function getInviteExpense(expenseId){
        await getExpense(expenseId, token).then((response)=>{
            setSelectedExpense(response)
        })
    }

    useEffect(()=>{
        var tempInvitations=[]
        var expTitle = ""
        var owner = ""

        getInvitations()
        
        if(invitations.length === 0){
            document.getElementById('number').style.visibility='hidden'
        } else{
            document.getElementById('number').style.visibility='visible'
            
            invitations.map(invite =>{
                getInviteExpense(invite.expense,token).then((response)=>{
                    expTitle = response.title;
                    owner = response.participants[0].name
                    tempInvitations.push({
                        _id:invite._id,
                        title:expTitle,
                        owner:owner+" ("+response.participants[0].email+")",
                        value:invite.participationValue,
                        totaValue:response.totalValue,
                        descricao:response.description,
                        expense:invite.expense
                    })
                })
            })
        }
        setDetailedInvitations(tempInvitations)
        console.log(detailedInvitations)
    },[])

    const notification = (
        <div>
          <i className="fa fa-globe" />
          <b className="caret" />
          <span id="number" className="notification">{invitations.length}</span>
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
                    invite=>{}):
                     
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