import React, {Component} from 'react'
import {getAllInvitations, getExpense, getUserFromID, acceptInviteReq, rejectInviteReq} from '../../services/index'
import { withRouter } from 'react-router';
import {Card, Button,Container, Row, Col} from 'react-bootstrap'
import './inviteComponent.css'
import backImg from '../../../src/images/left-arrow.png'

class InviteComponent extends Component {

    constructor(props) {
        super(props)

        this.loadInvites = this.loadInvites.bind(this)
        this.getExpenseTitle = this.getExpenseTitle.bind(this)
        this.getUserName = this.getUserName.bind(this)
        this.acceptInvite = this.acceptInvite.bind(this)
        this.rejectInvite = this.rejectInvite.bind(this)

        this.state = {
            invitations: []
            }
    }

    loadInvites = () => {
        const token = localStorage.getItem('token-contare')
        
        getAllInvitations(token, function(response){
            if(response.length >= 0) {
                this.setState({invitations: response})
                
                this.state.invitations.map(invite =>{
                    this.getExpenseTitle(invite.expense)
                })


            } else {
                this.props.history.push("/")
                
            }
        }.bind(this))
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

    render() {
        return (
            <div style={{height:'100vh',backgroundColor:'rgb(92, 174, 230)'}}>
            <div>
            <img onClick={()=> this.props.history.push("/dashboard")} id="imgBack" src={backImg} />
            <h1 id="invitePageTitle">Seus Convites</h1>
            </div>
            <Container className="containerInvites">
               
            <Row style={{backgroundColor:'rgb(92, 174, 230)', width:'100vw'}}>
            
             {this.state.invitations.map(invite => (

                 <Col md={4} xs={12} sm={6}>
                 <Card className="card" bg="info" text="white"  >
                 <Card.Header style={{textAlign:'center', fontSize:'30px'}}>Convite</Card.Header>
                 <Card.Body>
                   <Card.Text>
                   {this.getUserName(invite.from)}
                     Você foi convidado para a despesa: <a>{invite.expense.expenseTitle} </a> <br/>
                     Você foi convidado por:<a> {invite.from.fromName}</a><br/>
                     Seu valor a pagar é de: <a> R$ {invite.participationValue} </a><br/>

                     <div style={{marginTop:'10px'}}>
                     <Button onClick={() => this.acceptInvite(invite._id)} variant="success" style={{float: 'left'}}>Aceitar</Button>
                     <Button onClick={() => this.rejectInvite(invite._id)} variant="danger" style={{float: 'right'}}>Rejeitar</Button>
                     </div>
                   </Card.Text>
                 </Card.Body>
               </Card>
               </Col>
            ))}

    </Row>
            </Container>
            </div>
        )
    }

}

export default withRouter(InviteComponent)