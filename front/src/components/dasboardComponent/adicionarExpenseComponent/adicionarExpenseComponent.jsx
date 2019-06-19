import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import AddExpenseStyled from './styled';

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { addExpenses, getUser, getAllEmail } from '../../../services';

import "react-datepicker/dist/react-datepicker.css";
import { Table } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input';


import checkIcon from '../../../images/check.svg'
import deleteIcon from '../../../images/detele.svg'

import Select from 'react-select';

import $ from "jquery";

import DatePicker, { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';
registerLocale('pt', pt);



class AdicionarExpenseComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      listParticipants: [],
      user: {},
      emailNewParticipant: null,
      payValueNewParticipant: "",
      listEmail: [],
      valid: true,
      isControleRefresh: true, //variavel de controle para refresh
      isFormValid: false, 
      isDividirDispesa : false

    };
    this.handleChange = this.handleChange.bind(this);
    this.saveExpense = this.saveExpense.bind(this);
    this.changeDivisaoDespesa = this.changeDivisaoDespesa.bind(this);
    this.adicionarParticipant = this.adicionarParticipant.bind(this);
    this.handle = this.handle.bind(this);
    this.updateListParticipant = this.updateListParticipant.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.replaceAll = this.replaceAll.bind(this);
    this.refresh = this.refresh.bind(this);
    this.validaCampos = this.validaCampos.bind(this);
    this.verificaCamposValores = this.verificaCamposValores.bind(this);
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
      date: date
    });
  }


  validaCampos(id) {
    let valor = $(`#${id}`).val();
    if (this.state.valid) {
      return true;
    } else if (id.indexOf("valor") > -1 && valor !== "R$ 0,00") {
      return true;
    } else if (id.indexOf("valor") === -1 && valor) {
      return true;
    }

    return false;
  }

  verificaCamposValores() {
    if (this.state.isDividirDispesa) {
      for (let i = 0; i < this.state.listParticipants.length; i++) {
        if ($(`#valor-${i}`).val() === "R$ 0,00") {
          return true;
        }
      }
    }
    else {
      if ($(`#valor-principal`).val() === "R$ 0,00") {
        return true;
      }
    }

    return false;
  }

  async saveExpense(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity() || this.verificaCamposValores()) {
      this.setState({ valid: false });
      return;
    }
    let body = {};

    body.title = form.elements[0].value;
    body.description = form.elements[1].value;

    let value = String(this.state.money).replace("R$ ", "");
    value = this.replaceAll(value, ".", "");
    body.totalValue = value.replace(",", ".");

    
    let date = this.state.isDividirDispesa ? form.elements[2].value : form.elements[3].value;
    body.dueDate = date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);

    let listEmail = [];

    if (this.state.listParticipants.length > 1) {
      this.state.listParticipants.forEach(obj => {

        if (typeof obj.payValue === "number") {
          value = obj.payValue;
        } else {
          value = obj.payValue.replace("R$ ", "");
          value = this.replaceAll(value, ".", "");
          value = value.replace(",", ".")
        }
        listEmail.push({ email: obj.email, payValue: value })
      });
    } else {
      listEmail.push({ email: this.state.listParticipants[0].email, payValue: value.replace(",", ".") })
    }

    body.listEmail = listEmail;

    await addExpenses(localStorage.getItem("token-contare"), body);
    this.props.updateCard();
  }

  changeDivisaoDespesa(event) {
    this.setState({
      isDividirDispesa: (event.target.value === "true"),
      valid: true
    })
  }

  atualizaValorTotal(list) {
    let valueTotal = 0;
    list.forEach(element => {
      let payValue = element.payValue;
      if (isNaN(Number(payValue))) {
        payValue = this.replaceAll(payValue, "R$ ", "");
        payValue = this.replaceAll(payValue, ".", "");
        payValue = this.replaceAll(payValue, ",", ".");
        valueTotal += Number(payValue);
      } else {
        valueTotal += payValue;
      }
    });

    return `R$ ${(valueTotal + "").replace(".", ",")}`
  }

  adicionarParticipant() {
    if (this.state.payValueNewParticipant === "" || this.state.emailNewParticipant == null) {
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
    let valorTotalAtualizado = this.atualizaValorTotal(this.state.listParticipants);

    this.setState({
      listEmail: listEmailNew,
      listParticipants: listAux,
      emailNewParticipant: null,
      payValueNewParticipant: "",
      money: valorTotalAtualizado
    })


  }

  updateListParticipant(list, email) {

    this.setState({
      listParticipants: list,
      money: this.atualizaValorTotal(list)
    })
    if (email) {
      this.getAllemail();
    }
  }

  replaceAll(string, token, newtoken) {
    while (string.indexOf(token) !== -1) {
      string = string.replace(token, newtoken);
    }
    return string;
  }

  refresh() {
    this.setState({
      isControleRefresh: !this.state.isControleRefresh
    })
  }

  render() {
    return (
      <AddExpenseStyled>

        <Modal.Header>
          <Modal.Title id="contained-modal-title-adicionar">
            Adicionar Nova Despesa
          </Modal.Title>
        </Modal.Header>

        <Form
          noValidate
          onSubmit={e => this.saveExpense(e)}
        >
          <Modal.Body>

            <Form.Group as={Row} controlId="titulo">
              <Form.Label column sm="3">
                Título
              </Form.Label>
              <Col sm="9">
                <Form.Control required={true} isInvalid={!this.validaCampos("titulo")} onChange={this.refresh} controlId type="text" placeholder="Título" />
                <Form.Control.Feedback type="invalid">
                  Por favor digite o título da despesa.
              </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="descricao">
              <Form.Label column sm="3">
                Descrição
              </Form.Label>
              <Col sm="9">
                <Form.Control required={true} isInvalid={!this.validaCampos("descricao")} type="text" onChange={this.refresh} controlId placeholder="Descrição" />
                <Form.Control.Feedback type="invalid">
                  Por favor digite a descrição da despesa.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {
              this.state.isDividirDispesa ? "" :
                <Form.Group as={Row} controlId="valor-principal">
                  <Form.Label column sm="3">
                    Valor da despesa
                  </Form.Label>
                  <Col sm="9">
                    <CurrencyInput className={"form-control " + (this.validaCampos("valor-principal") ? "" : "is-invalid")} id="valor-principal" required={true} isInvalid={this.validaCampos} prefix="R$ " decimalSeparator="," thousandSeparator="." value={this.state.money} name="money" type="text" placeholder="Valor da despesa" onChangeEvent={this.handle} />
                    <Form.Control.Feedback type="invalid" className={(this.validaCampos("valor-principal") ? "display-none" : "display-block")}>
                      Valor da despesa tem que ser maior que zero.
                </Form.Control.Feedback>
                  </Col>
                </Form.Group>
            }
            <Form.Group as={Row} controlId="dueDate">
              <Form.Label column sm="3">
                Data de Validade
              </Form.Label>
              <Col sm="9">
                
                <DatePicker required={true} className="form-control"
                  selected={this.state.date}
                  onChange={this.handleChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  locale="pt"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor digite a data de validade.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="dividir">
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
                          <CurrencyInput className="remove-validacao form-control" type="text" prefix="R$ " decimalSeparator="," thousandSeparator="." name="payValueNewParticipant" placeholder="Valor" value={this.state.payValueNewParticipant} onChangeEvent={this.handle} />
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
                        var replaceAll = this.replaceAll;

                        function updateValue(e) {
                          let auxList = [];
                          list.forEach(element => {
                            let auxP = element;
                            if (auxP.email === p.email) {
                              let value = e.target.value.replace("R$ ", "");
                              value = replaceAll(value, ".", "");
                              auxP.payValue = value.replace(".", ",")
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
                                <CurrencyInput className={"form-control " + (this.validaCampos(`valor-${i}`) ? "" : "is-invalid")} id={`valor-${i}`} required={true} type="text" prefix="R$ " decimalSeparator="," thousandSeparator="." name="payValueNewParticipant" placeholder="Valor" value={p.payValue} onChangeEvent={updateValue} />
                                <Form.Control.Feedback type="invalid" className={(this.validaCampos(`valor-${i}`) ? "display-none" : "display-block")}>
                                  Valor da despesa tem que ser maior que zero.
                                </Form.Control.Feedback>
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


            {
              this.state.isDividirDispesa ?
                <Form.Group as={Row} controlId="payValue">
                  <Form.Label column sm="9" style={{ textAlign: "right" }}>
                    Valor Total da despesa
                  </Form.Label>
                  <Col sm="3">
                    <CurrencyInput className="form-control" disabled isInvalid={this.validaCampos} prefix="R$ " decimalSeparator="," thousandSeparator="." value={this.state.money} name="money" type="text" />
                  </Col>
                </Form.Group>
                : ""
            }

          </Modal.Body>

          <Modal.Footer>
            <Button variant="success" type="submit">Adicionar</Button>
            <Button variant="danger" onClick={this.props.onHide}>Fechar</Button>
          </Modal.Footer>
        </Form>
      </AddExpenseStyled>
    );
  }
}

export default AdicionarExpenseComponent;
