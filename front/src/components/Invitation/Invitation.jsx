import React, {useState,useEffect} from 'react';
import {getExpense} from '../../services/expenseService';
import { acceptInviteReq, rejectInviteReq, getAllInvitations} from '../../services/inviteService.js';
import { MenuItem, NavDropdown, Button, ListGroupItem, ListGroup } from 'react-bootstrap';
import InvitationModal from './InvitationModal';


var token = localStorage.getItem('token-contare')
export default function Invitation(props) {
    const [invitations,setInvitations] = useState([]);
    const [detailedInvitations, setDetailedInvitations]= useState([])
    const [invitation, setInvitation] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMenuitem, setSelectedMenuItem] = useState({})

    const toggleModal= ()=>{
        setIsModalOpen(!isModalOpen)
    }

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

    function acceptInvitation(inviteId){
        var temp = []
        detailedInvitations.map(i => {
            if(i._id !== inviteId) temp.push(i)
        })
        setDetailedInvitations(temp)

        temp = []
        invitations.map(i => {
            if(i._id !== inviteId) temp.push(i)
        })
        setInvitations(temp)

        acceptInviteReq(inviteId,token)
    }

    function rejectInvitation(inviteId){
        var temp = []
        
        detailedInvitations.map(i => {
            if(i._id !== inviteId) temp.push(i)
        })
        setDetailedInvitations(temp)

        temp = []
        invitations.map(i => {
            if(i._id !== inviteId) temp.push(i)
        })
        setInvitations(temp)

        rejectInviteReq(inviteId,token)
    }

    return(
        <NavDropdown
                eventKey={2}
                title={notification}
                noCaret
                id="basic-nav-dropdown"
        >
            <InvitationModal
                isOpen={isModalOpen}
                invitation={selectedMenuitem}
                setShow={toggleModal}
                invitation={selectedMenuitem}
                accept={acceptInvitation}
                reject={rejectInvitation}
            />
            {
               (detailedInvitations.length > 0) ? detailedInvitations.map(
                    invite=><MenuItem key={invite._id}>
                                <Button onClick={()=>toggleModal() & setSelectedMenuItem(invite)}>
                                    {invite.title}
                                </Button>

                                <Button 
                                    bsStyle="success" 
                                    bsSize="xsmall" 
                                    onClick={()=>acceptInvitation(invite._id)}>✔</Button>

                                <Button 
                                    bsStyle="danger" 
                                    bsSize="xsmall"
                                    onClick={()=>rejectInvitation(invite._id)}>X</Button>
                            </MenuItem>):
               <MenuItem>Não há convites</MenuItem>
            }
        </NavDropdown>
    )
}