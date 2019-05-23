import React, { Component } from 'react';

import { deletedExpenses, updateExpenses } from '../../../services';

import { Col } from 'react-bootstrap';
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
      modalConfirmedFunction : ""
    }

    this.formataData = this.formataData.bind(this);
    this.deletedExpense = this.deletedExpense.bind(this);
    this.confirmed = this.confirmed.bind(this);
    this.hideModalAction = this.hideModalAction.bind(this);
    this.updateExpense = this.updateExpense.bind(this);
  }


  formataData(d) {
    var date = new Date(d);
    let data = date.getDate().toLocaleString().length > 1 ? date.getDate() + 1 : '0' + date.getDate();
    let mes = (date.getMonth() + 1).toLocaleString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    let ano = date.getFullYear();
    return `${data}/${mes}/${ano}`;
  }

  confirmed(acao, calback) {
    this.setState({
      modalAction: true,
      nomeAcao: acao, 
      modalConfirmedFunction : calback

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
  
  async updateExpense(){

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
                {this.props.expense.participants[0].status ? "" :
                  <img title="Pagar Despesa" alt="Pagar Despesa" style={{ width: "22px"}} src={payIcon} onClick={() => this.confirmed('Você confirma o pagamaneto da despesa?', this.updateExpense)} /> 
                }
                <img title="Excluir Despesa" alt="Excluir Despesa" src={deleteIcon} onClick={() => this.confirmed('Tem certeza que você quer deletar a despesa?', this.deletedExpense)} />
              </div>
            </Col>

          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <p>Descrição: {this.props.expense.description}</p>
          <p>Data de Criação: {this.formataData(this.props.expense.createdAt)} </p>
          <p>Data de Vencimento: {this.formataData(this.props.expense.dueDate)} </p>
          <p>Status: {this.props.expense.participants[0].status ? <b className="campo-pago">Pago</b> : <b className="campo-pagar">À pagar</b>}</p>

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
