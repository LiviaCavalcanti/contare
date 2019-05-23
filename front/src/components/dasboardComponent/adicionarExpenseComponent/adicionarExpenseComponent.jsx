import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import AddExpenseStyled from './styled';

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { addExpenses } from '../../../services';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



class AdicionarExpenseComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), 
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveExpense = this.saveExpense.bind(this);
  }


  handleChange(date) {
    this.setState({
      date: date
    });
  }
  
  async saveExpense(event) {
    event.preventDefault()
    const form = event.currentTarget;
    let body = {};

    body.title = form.elements[0].value;
    body.description = form.elements[1].value;
    body.payValue = form.elements[2].value.replace(",", ".");
    let date = form.elements[3].value;
    body.dueDate =  date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);


    await addExpenses(localStorage.getItem("token-contare"), body);
    this.props.updateCard();
  }

  render() {
    return (
      <AddExpenseStyled>

        <Modal.Header>
          <Modal.Title id="contained-modal-title-adicionar">
            Adicionar Nova Despesa
          </Modal.Title>
        </Modal.Header>

        <Form validated={this.state.validated} onSubmit={e => this.saveExpense(e)}>
          <Modal.Body>

            <Form.Group as={Row} controlId="title">
              <Form.Label column sm="3">
                Título
            </Form.Label>
              <Col sm="9">
                <Form.Control type="text" placeholder="Título" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="description">
              <Form.Label column sm="3">
                Descrição
              </Form.Label>
              <Col sm="9">
                <Form.Control type="text" placeholder="Descrição" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="payValue">
              <Form.Label column sm="3">
                Valor da despesa
              </Form.Label>
              <Col sm="9">
                <Form.Control value={this.state.money} type="text" placeholder="Valor da despesa" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="dueDate">
              <Form.Label column sm="3">
                Data de Validade
              </Form.Label>
              <Col sm="9">
                {/* <Form.Control type="text" placeholder="DD/MM/YYYY" /> */}
                <DatePicker className="form-control"
                  selected={this.state.date}
                  onChange={this.handleChange}
                  dateFormat="dd/MM/yyyy"
                />
              </Col>
            </Form.Group>


          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit">Adicionar</Button>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Form>
      </AddExpenseStyled>
    );
  }
}

export default AdicionarExpenseComponent;
