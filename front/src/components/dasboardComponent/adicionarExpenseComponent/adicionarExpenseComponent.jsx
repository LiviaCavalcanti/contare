import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import AddExpenseStyled from './styled';

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { addExpenses, getUser, getAllEmail } from '../../../services';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from 'react-bootstrap';

import checkIcon from '../../../images/check.svg'
import deleteIcon from '../../../images/detele.svg'

import Select from 'react-select';




class AdicionarExpenseComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      listParticipants: [],
      user: {},
      emailNewParticipant: null,
      payValueNewParticipant: "",
      listEmail: []

    };
    this.handleChange = this.handleChange.bind(this);
    this.saveExpense = this.saveExpense.bind(this);
    this.changeDivisaoDespesa = this.changeDivisaoDespesa.bind(this);
    this.adicionarParticipant = this.adicionarParticipant.bind(this);
    this.handle = this.handle.bind(this);
    this.updateListParticipant = this.updateListParticipant.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  async componentDidMount() {
    let user = await getUser(localStorage.getItem("token-contare"));
    this.setState({
      user: user,
      listParticipants: [{ email: user.email, payValue: 0.0 }]
    })

    this.getAllemail();
  }

  async getAllemail() {
    let list = await getAllEmail(localStorage.getItem("token-contare"));
    let listSelect = [];

    for (let index = 0; index < list.length; index++) {
      const email = list[index];
      let aux = {
        value: email, label: email
      }
      listSelect.push(aux);
    }

    this.setState({
      listEmail: listSelect
    });

  }

  handle(e) {
    let campo = {};
    let nomeCampo = e.target.name;
    campo[nomeCampo] = e.target.value;
    this.setState(campo);
  }

  handleChangeSelect = (emailNewParticipant) => {
    this.setState({ emailNewParticipant });
  }

  handleChange(date) {
    this.setState({
      date: date,
      isDividirDispesa: false
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
    body.dueDate = date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);

    let listEmail = [];

    this.state.listParticipants.forEach(obj => {
      listEmail.push({email : obj.email, payValue : Number(obj.payValue)})
    });
    body.listEmail = listEmail;

    await addExpenses(localStorage.getItem("token-contare"), body);
    this.props.updateCard();
  }

  changeDivisaoDespesa(event) {
    this.setState({
      isDividirDispesa: (event.target.value === "true")
    })
  }

  adicionarParticipant() {
    if(this.state.payValueNewParticipant === "" ||  this.state.emailNewParticipant == null){
      return;
    }
    let listAux = this.state.listParticipants;
    listAux.push({ payValue: this.state.payValueNewParticipant, email: this.state.emailNewParticipant.value });

    let listEmailNew = [];
    this.state.listEmail.forEach(element => {
      if (element.value !== this.state.emailNewParticipant.value) {
        listEmailNew.push(element);
      }
    });

    this.setState({
      listEmail: listEmailNew,
      listParticipants: listAux,
      emailNewParticipant: null,
      payValueNewParticipant: ""
    })
  }

  updateListParticipant(list, email) {
    this.setState({
      listParticipants: list,
    })
    if (email) {
      this.getAllemail();
    }
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
                <DatePicker className="form-control"
                  selected={this.state.date}
                  onChange={this.handleChange}
                  dateFormat="dd/MM/yyyy"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="dueDate">
              <Form.Label column sm="3">
                Dividir a despesa?
              </Form.Label>
              <Col sm="9">
                <div className="mb-3" style={{ marginTop: "8px" }} onChange={this.changeDivisaoDespesa}>
                  <Form.Check inline checked={this.state.isDividirDispesa} label="Sim" name="dividir-despesa" value={true} type={"radio"} id={`inline-1`} />
                  <Form.Check inline checked={!this.state.isDividirDispesa} label="Não" name="dividir-despesa" value={false} type={"radio"} id={`inline-1`} />
                </div>
              </Col>
            </Form.Group>



            {
              this.state.isDividirDispesa ?

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: "60%" }}>Email</th>
                      <th >Valor</th>
                      <th className="acao" style={{ width: "10%" }}>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td >
                        <Form.Group controlId="emailNewParticipant">
                          <Select
                            value={this.state.emailNewParticipant}
                            onChange={this.handleChangeSelect}
                            options={this.state.listEmail}
                          />
                        </Form.Group>
                      </td>
                      <td>
                        <Form.Group controlId="payValueNewParticipant">
                          <Form.Control type="text" name="payValueNewParticipant" placeholder="Valor" value={this.state.payValueNewParticipant} onChange={this.handle} />
                        </Form.Group>
                      </td>
                      <td className="acao">
                        <img onClick={() => this.adicionarParticipant()} className="icon-acao" alt="" src={checkIcon} />
                      </td>
                    </tr>
                    {
                      this.state.listParticipants.map((p, i) => {
                        var updateListParticipant = this.updateListParticipant;
                        var list = this.state.listParticipants;

                        function updateValue(e) {
                          let auxList = [];
                          list.forEach(element => {
                            let auxP = element;
                            if (auxP.email === p.email) {
                              auxP.payValue = e.target.value;
                            }
                            auxList.push(auxP);
                          });
                          updateListParticipant(auxList)
                        }

                        function deletarParticipant() {
                          let aux = [];
                          list.forEach(element => {
                            if (element.email !== p.email) {
                              aux.push(element);
                            }
                          });
                          updateListParticipant(aux, p.email)
                        }

                        return (
                          <tr >
                            <td>{p.email}</td>
                            <td>
                              <Form.Group controlId="payValueNewParticipant">
                                <Form.Control type="text" name="payValueNewParticipant" placeholder="Valor" value={p.payValue} onChange={updateValue} />
                              </Form.Group>
                            </td>
                            <td className="acao">
                              {
                                i > 0 ?
                                  <img onClick={() => deletarParticipant()} className="icon-acao" alt="" src={deleteIcon} />
                                  : ""
                              }
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>

                : ""
            }

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
