import React, {Component} from 'react'
import {getAllInvitations, getExpense} from '../../services/index'
import { withRouter } from 'react-router';
import {Card, Button,Container, Row} from 'react-bootstrap'
import './inviteComponent.css'
import backImg from '../../../src/images/left-arrow.png'

class InviteComponent extends Component {

    constructor(props) {
        super(props)

        this.loadInvites = this.loadInvites.bind(this)
        this.getExpenseTitle = this.getExpenseTitle.bind(this)
        
        this.state = {
            invitations: [],
            expensesTitles:[]
        }
    }

    loadInvites = () => {
        const token = localStorage.getItem('token-contare')
        
        getAllInvitations(token, function(response){
            if(response.length >= 0) {
                this.setState({invitations: response})
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
            // ARRUMAR UM JEITO DE RETORNAR O RESPONSE TITLE DAQUI
        }.bind(this))
      }

    render() {
        return (
            <div style={{height:'100vh', backgroundColor:'rgb(92, 174, 230)'}}>
            <div>
            <img onClick={()=> this.props.history.push("/dashboard")} id="imgBack" src={backImg} />
            <h1 id="invitePageTitle">Seus Convites</h1>
            </div>
            <Container className="containerInvites">
               
            <Row>
            
             {this.state.invitations.map(invite => (
                 <Card className="card" bg="info" text="white" style={{ width: '18rem' }}>
                 <Card.Header style={{textAlign:'center', fontSize:'30px'}}>Convite</Card.Header>
                 <Card.Body>
                   <Card.Text>
                     Você foi convidado para a despesa: {this.getExpenseTitle(invite.expense)}  <br/>
                     Seu valor a pagar é de: XXX.<br/>
                     Você foi convidado por XXX.<br/>
                     <div style={{marginTop:'10px'}}>
                     <Button variant="success" style={{float: 'left'}}>Aceitar</Button>
                     <Button variant="danger" style={{float: 'right'}}>Rejeitar</Button>
                     </div>
                   </Card.Text>
                 </Card.Body>
               </Card>
            ))}

    </Row>
            </Container>
            </div>
        )
    }

}

export default withRouter(InviteComponent)