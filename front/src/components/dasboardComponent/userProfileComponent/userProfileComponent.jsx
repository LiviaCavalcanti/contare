import React, {Component} from 'react'
import './userProfileComponent.css'
import avatar from '../../../images/avatar.jpg'
import invitationIcon from '../../../images/invitation.svg'
import {Button, Alert, Modal} from 'react-bootstrap' 
import {notifyFailure, updateUser, getAllInvitations} from '../../../services'
import { withRouter } from 'react-router';

class UserProfile extends Component {

    constructor(props) {
        super(props);
    
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.calculateExpenses = this.calculateExpenses.bind(this)
        this.listInviteNumber = this.listInviteNumber.bind(this)
        this.formatToReal = this.formatToReal.bind(this)

    
        this.state = {
          show: false,
          inviteNumber: 0
        }

      }

      calculateExpenses = (myUser) => {
        let totalInc = 0
        const expenses = this.props.list
        expenses.map(expense =>{
            if(expense.participants) {
                expense.participants.map(participant =>{
                    if(participant.name === myUser.name && participant.status === false){
                        totalInc += participant.payValue
                    }
                })
            }
        })

        return totalInc
      }

      handleClose() {
        this.setState({ show: false });
      }
    
      handleShow() {
        this.setState({ show: true });
      }

      handleSubmit() {
          const newRent = document.getElementById('rent').value
        const token = localStorage.getItem('token-contare')
          if(newRent != ""){
              let actualUser = this.props.user
              actualUser.rent = newRent
            updateUser(token, actualUser, function(response){
                console.log(response)
            })



              this.setState({ show: false });
          } else {
            notifyFailure("Insira um valor válido!")
          }

      }

      listInviteNumber = () => {
        const token = localStorage.getItem('token-contare')
        
        getAllInvitations(token, function(response){
            this.setState({inviteNumber: response.length})
        }.bind(this))
      }
      
    componentWillMount(){
      this.listInviteNumber()
    }

    formatToReal = (value) => {
      return value.replace('.', ',')
    }

    render() {
        return (
            <div className="userInfo">
            <img alt="" src={avatar} className="avatarImage" />
            <h1>Bem-Vindo</h1>
            <Alert variant="primary">
            
            {this.props.user.name} <br/>
            <div className="inviteDiv">
            {this.state.inviteNumber == 0 ? 
                        <p id="invitesText">Convites ({this.state.inviteNumber})</p>

                        :

                        <p id="invitesText">Convites <a style={{color:'red'}}>({this.state.inviteNumber})</a></p>
          
          }
            
            
            <img id="invitesIcon" onClick={() => this.props.history.push("/invite")}  src={invitationIcon} style={{width:"30px", height:"30px"}}/>

            </div>
            </Alert>
            <Alert variant="success"> Sua renda atual é de: R$ {this.formatToReal(Number(this.props.user.rent).toFixed(2))} </Alert>
            <Alert variant="danger">Seu gasto atualmente é de: <br/>R$ {this.formatToReal(Number(this.calculateExpenses(this.props.user)).toFixed(2))} <br/> Atualmente te sobra por mês: <br/>R$ {this.formatToReal(Number(this.props.user.rent - this.calculateExpenses(this.props.user)).toFixed(2)) } </Alert>
            <Button variant="info" onClick={this.handleShow}>Altere sua renda</Button>


        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header  className="userRentModal"> 
            <Modal.Title className="modalTitle">Altere o quanto você recebe!</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Alert variant="primary"><b>Por que isso é necessário? </b><br/> É extremamente importante que você informe o quanto recebe para que nossa aplicação consiga informar melhor todos seus gastos perante sua renda!</Alert>

            <p>Informe sua nova renda</p>

            <input id="rent" type="number" min="0.00" max="100000.00" step="0.01" />
          
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleClose}>
              Fechar
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
               Mudar renda
            </Button>
          </Modal.Footer>
        </Modal>
            </div>
        )
    }
}

export default withRouter(UserProfile)