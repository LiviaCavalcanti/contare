import React, { Component } from 'react';

import { deletedExpenses, updateExpenses } from '../../../services';

import { Col, Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ConfirmedActionComponent from '../../confirmedActionComponent/ConfirmedActionComponent';

import DetalharExpenseStyled from './styled';
import deleteIcon from '../../../images/detele.svg'
import payIcon from '../../../images/coin.svg'



class DetalharExpenseComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalAction: false,
      nomeAcao: "",
      isEdited: false,
      modalConfirmedFunction: "", 
      listParticipants : [], 
      valueTotal : 0
    }

    this.formataData = this.formataData.bind(this);
    this.deletedExpense = this.deletedExpense.bind(this);
    this.confirmed = this.confirmed.bind(this);
    this.hideModalAction = this.hideModalAction.bind(this);
    this.updateExpense = this.updateExpense.bind(this);
  }

  async componentDidMount() {
    // let listAux = [];
    let valueTotal = 0;
    
    this.props.expense.participants.forEach(element => {
      // element.email = "Buscar email pelo ID ainda não existe " + element._id;
      // listAux.push(element);
      valueTotal += element.payValue;
    });

    this.setState({
      // listParticipants : listAux,
      valueTotal : valueTotal
    })

    // let user = await getUser(localStorage.getItem("token-contare"));
    // this.setState({
    //   user: user,
    //   listParticipants: [{ email: user.email, payValue: 0.0 }]
    // })

  }

  formataData(d) {
    var date = new Date(d);
    let data = date.getDate().toLocaleString().length > 1 ? date.getDate()  : '0' + date.getDate();
    let mes = (date.getMonth() + 1).toLocaleString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    let ano = date.getFullYear();
    return `${data}/${mes}/${ano}`;
  }

  confirmed(acao, calback) {
    this.setState({
      modalAction: true,
      nomeAcao: acao,
      modalConfirmedFunction: calback
    })

  }

  hideModalAction() {
    this.setState({
      modalAction: false,
    })
  }

  async deletedExpense() {
    await deletedExpenses(localStorage.getItem("token-contare"), this.props.expense._id);
    this.hideModalAction();
    this.props.updateCard();
  }

  async updateExpense() {

    let body = this.props.expense;

    body.participants[0].status = true;

    await updateExpenses(localStorage.getItem("token-contare"), this.props.expense._id, body);
    this.hideModalAction();
    this.props.updateCard();
  }

  render() {
    return (
      <DetalharExpenseStyled>

        <Modal.Header >
          <Modal.Title id="contained-modal-title-detalhe">
            <Col>
              <div className="div-title">
                {this.props.expense.title} - Detalhe
              </div>
              <div className="div-acao">
                {this.props.expense.participants.length > 0 && this.props.expense.participants[0].status ? "" :
                  <img title="Pagar Despesa" alt="Pagar Despesa" style={{ width: "22px" }} src={payIcon} onClick={() => this.confirmed('Você confirma o pagamaneto da despesa?', this.updateExpense)} />
                }
                <img title="Excluir Despesa" alt="Excluir Despesa" src={deleteIcon} onClick={() => this.confirmed('Tem certeza que você quer deletar a despesa?', this.deletedExpense)} />
              </div>
            </Col>

          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="div-dado">
            <label>Descrição:</label>
            <p> <b>{this.props.expense.description}</b></p>
          </div>
          <div className="div-dado">
            <label>Data de Criação:</label>
            <p> <b>{this.formataData(this.props.expense.createdAt)} </b></p>
          </div>
          <div className="div-dado">
            <label>Data de Vencimento: </label>
            <p><b>{this.formataData(this.props.expense.dueDate)} </b></p>
          </div>


          <div className="div-dado">
            <label>Valor Total da despesa:</label>
            <p><b>{this.props.expense.totalValue} </b></p>
          </div>
          {/* <div className="div-dado">
            <label>Status:</label>
            <p> <b>{this.props.expense.participants[0].status ? <b className="campo-pago">Pago</b> : <b className="campo-pagar">À pagar</b>}</b></p>
          </div> */}

          <p className="p-title">

            Detalhamento dos participantes
          </p>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Nome</th>
                <th style={{ width: "25%" }}>Email</th>
                <th >Valor</th>
                <th className="acao" style={{ width: "20%" }}>Status</th>
                <th className="acao" style={{ width: "20%" }}>Status Convite</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.expense.participants.map((p, i) => {
                  return (
                    <tr key={`participants-${i}`}>
                      <td >
                        {p.name}
                      </td>
                      <td >
                        {p.email}
                      </td>
                      <td>
                        {p.payValue}
                      </td>
                      <td >
                        {p.status ? <b className="campo-pago">Pago</b> : <b className="campo-pagar">À pagar </b>}
                      </td>
                      <td >
                        {
                          i == 0 ?
                           '- ' : 
                           (p.participantStatus === 'ACTIVE' ? <b className="campo-pago">Aceito</b> : p.participantStatus === 'WAITING' ? <b className="campo-aguardando">Aguardando</b> : <b className="campo-pagar"> Rejeitado </b>)
                        }
                      </td>
                      

                    </tr>

                  )
                })
              }

            </tbody>
          </Table>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>


        <Modal
          size="sm"
          aria-labelledby="contained-modal-title-confirmed-action"
          centered
          show={this.state.modalAction}
        >
          <ConfirmedActionComponent acao={this.state.nomeAcao} confirmar={this.state.modalConfirmedFunction} cancelar={this.hideModalAction} />

        </Modal>
      </DetalharExpenseStyled>
    );
  }
}

export default DetalharExpenseComponent;
