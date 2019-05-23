import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DetalharTaskStyled from './styled.jsx';


class DetalharTaskComponent extends Component {

  constructor(props) {
    super(props);

    console.log("wag props ", props);
    this.formataData = this.formataData.bind(this);
  }


  formataData(d){
    var date = new Date(d);
    let data = date.getDate().toLocaleString().length > 1 ? date.getDate() + 1 : '0'+date.getDate();
    let mes = (date.getMonth() + 1).toLocaleString().length > 1 ? date.getMonth() + 1 : '0'+ (date.getMonth() + 1);
    let ano = date.getFullYear();
    return `${data}/${mes}/${ano}`;
}

  render() {
    return (
      <DetalharTaskStyled>

        <Modal.Header >
          <Modal.Title id="contained-modal-title-detalhe">
            {this.props.task.title} - Detalhe
              </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <p>Descrição: {this.props.task.description}</p>
          <p>Data de Criação: {this.formataData(this.props.task.createdAt)} </p>
          <p>Data de Vencimento: {this.formataData(this.props.task.dueDate)} </p>
          <p>Status: {this.props.task.participants[0].status ? <b className="campo-pago">Pago</b> : <b className="campo-pagar">À pagar</b>}</p>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </DetalharTaskStyled>
    );
  }
}

export default DetalharTaskComponent;
