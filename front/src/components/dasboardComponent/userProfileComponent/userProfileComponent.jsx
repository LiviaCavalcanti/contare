import React, {Component} from 'react'
import './userProfileComponent.css'
import avatar from '../../../images/avatar.jpg'
import invitationIcon from '../../../images/invitation.svg'
import {Button, Alert, Modal} from 'react-bootstrap' 
import {notifyFailure, updateUser, getAllInvitations, notifySucess} from '../../../services'
import { withRouter } from 'react-router';
import GoAlert from 'react-icons/lib/go/alert'

class UserProfile extends Component {

    constructor(props) {
        super(props);
    
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleShowEdit = this.handleShowEdit.bind(this)
        this.handleCloseEdit = this.handleCloseEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
        this.calculateExpenses = this.calculateExpenses.bind(this)
        this.listInviteNumber = this.listInviteNumber.bind(this)
        this.formatToReal = this.formatToReal.bind(this)

    
        this.state = {
          show: false,
          showEdit: false,
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

      handleCloseEdit() {
        this.setState({ showEdit: false });
      }
    
      handleShowEdit() {
        this.setState({ showEdit: true });
      }

      handleSubmitEdit() {
        const newName = document.getElementById('newName').value
        const newPass = document.getElementById('newPass').value
        const newPassConfirm = document.getElementById('newPassConfirm').value

        if(newName == "" || newPass == "" || newPassConfirm == "") {
          notifyFailure("Preencha todos os campos corretamente!")
        } else {
          if(newPass !== newPassConfirm) {
            notifyFailure("Senhas não conferem!")
          } else {
            let newUser = this.props.user
            newUser.name = newName
            newUser.password = newPass
            const token = localStorage.getItem('token-contare')
            updateUser(token, newUser, function(response){
              notifySucess("Perfil alterado com sucesso!")
              this.setState({ showEdit: false });
          }.bind(this))


          }
        }

      }

      handleSubmit() {
          const newRent = document.getElementById('rent').value
        const token = localStorage.getItem('token-contare')

          if(newRent != "" && newRent >= 0){
              let actualUser = this.props.user
              actualUser.rent = newRent
            updateUser(token, actualUser, function(response){
              notifySucess("Renda alterada com sucesso!")
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
            <h2>Bem-Vindo</h2>
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
            <Alert variant="danger">
            Seu gasto atualmente é de: <br/>
            R$ {this.formatToReal(Number(this.calculateExpenses(this.props.user)).toFixed(2))}
             <br/> Atualmente te sobra por mês: <br/>
             R$ {this.formatToReal(Number(this.props.user.rent - this.calculateExpenses(this.props.user)).toFixed(2)) } 
            <br/> 
            {
             (Number(this.props.user.rent).toFixed(2) -  Number(this.calculateExpenses(this.props.user)).toFixed(2) < 0) ? <div><GoAlert/> <b>ALERTA </b><GoAlert/> <br/> Você está gastando mais do que recebe  </div>
             : null
            }
              
            
            </Alert>
            <Button style={{marginTop: '5px', marginBottom:'5px'}} variant="info" onClick={this.handleShow}>Altere sua renda</Button>
            <Button style={{marginLeft: '5px', marginTop: '5px', marginBottom:'5px'}} variant="warning" onClick={this.handleShowEdit}>Altere seu perfil</Button>

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



        <Modal show={this.state.showEdit} onHide={this.handleCloseEdit}>
          <Modal.Header className="userRentModal">
            <Modal.Title className="modalTitle">Edite seu perfil!</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <Alert variant="warning"><b>Sobre mudanças no perfil: </b><br/> 
          É importante que você escolha uma senha segura, por isso, evite senhas genéricas ou com informações pessoais.
          </Alert>

            
            Escolha um novo nome: <br/> 
            <input id="newName" type="text" defaultValue={this.props.user.name}/><br/> 
            Escolha uma nova senha: <br/> 
            <input id="newPass" type="password"/><br/> 
            Confirme sua nova senha: <br/> 
            <input id="newPassConfirm" type="password"/>
             
            </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleCloseEdit}>
              Fechar
            </Button>
            <Button variant="primary" onClick={this.handleSubmitEdit}>
              Salvar mudanças
            </Button>
          </Modal.Footer>
        </Modal>

            </div>
        )
    }
}

export default withRouter(UserProfile)