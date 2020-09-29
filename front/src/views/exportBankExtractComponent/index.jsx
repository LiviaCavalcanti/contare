import React from "react"
import {Modal, Button, Form, FormGroup, ControlLabel, FormControl, Alert} from "react-bootstrap"
import {notifyFailure, notifySucess} from "../../services/notifyService"
import ListExtract from "./ListExtract"

export default class BankExtractModal extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleFiles = this.handleFiles.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.createExpenseAndIncomesForBB = this.createExpenseAndIncomesForBB.bind(this)
      this.readBankCSV = this.readBankCSV.bind(this)
      this.formatData = this.formatData.bind(this)
      this.handleList = this.handleList.bind(this)
  
      this.state = {
        showFileModal: false,
        showExtractModal: false,
        file: null,
        bancoDoBrasilColumnsValues: {
          data: 0,
          origem: 1,
          title: 2,
          data_balancete: 3,
          id_transacao: 4,
          valor: 5,
          not_named: 6
        },
        caixaColumnsValues: {
          conta: 0,
          data: 1, 
          nr_doc: 2, 
          historico: 3, 
          valor: 4, 
          deb_Cred: 5
        },
        extractObjects:[],
        
      };
    }
  
    handleSubmit = () => {
      if (this.state.file == null) {
        notifyFailure("É necessário selecionar um arquivo para importar!")
      } else {
        let bankOption = document.getElementById('bankSelect')
        bankOption = bankOption.options[bankOption.selectedIndex].value
        let lines = []
        let extractObjects = []
        switch(bankOption) {
          case "bb":
            lines = this.readBankCSV(',')
            extractObjects = this.createExpenseAndIncomesForBB(lines)
            break
          case "caixa":
            lines = this.readBankCSV(';')
            extractObjects = this.createExpenseAndIncomesForCaixa(lines)
            break
        }
        this.setState(extractObjects=extractObjects)
      }
    }

    readBankCSV = (delimiter) => {
      const allTextLines = this.state.file.split(/\r\n|\n/);
      var headers = allTextLines[0].split(delimiter);
      var lines = [];
  
      for (var i=1; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(delimiter);
          if (data.length == headers.length) {
              var tarr = [];
              for (var j=0; j<headers.length; j++) {
                  const payload = data[j].substring(1, data[j].length-1)
                  tarr.push(payload)
              }
              lines.push(tarr);
          }
      }
      return lines
    }

    createExpenseAndIncomesForBB  = (bankData) => {
      var extractObjects = []

      for(let i = 0; i < bankData.length; i++) {
        if(bankData[i][this.state.bancoDoBrasilColumnsValues["origem"]] != "") {
          const objTitle = bankData[i][this.state.bancoDoBrasilColumnsValues["title"]]
          const objDate  = bankData[i][this.state.bancoDoBrasilColumnsValues["data"]]
          const description = "Criado na conta: " +
                              bankData[i][this.state.bancoDoBrasilColumnsValues["origem"]] +
                              " Com o ID de transação: " +
                              bankData[i][this.state.bancoDoBrasilColumnsValues["id_transacao"]]
          const value = parseFloat(bankData[i][this.state.bancoDoBrasilColumnsValues["valor"]]).toFixed(2)

          // positive value indicate that is a income. negative is a expense.
          if(value > 0) {
            const extractObj = {title: objTitle, description: description, value: value, date:objDate, periodicity:"NONE", type: "Receita"}
            extractObjects.push(extractObj)
          }
           else {
            const extractObj = {
              type: "Despesa",
              title: objTitle,
              description: description,
              date: objDate,
              periodicity: "NONE",
              value: (value * -1)
            }
            extractObjects.push(extractObj) 
          }
        }
      }
       return {extractObjects}
    }

    createExpenseAndIncomesForCaixa  = (bankData) => {
      var extractObjects = []

      for(let i = 0; i < bankData.length; i++) {
        if(bankData[i][this.state.caixaColumnsValues["valor"]] != "0.00") {
          const objTitle = bankData[i][this.state.caixaColumnsValues["conta"]]
          const objDate  = this.formatData(bankData[i][this.state.caixaColumnsValues["data"]])
          const description = "Criado na CAIXA na conta: " +
                              bankData[i][this.state.caixaColumnsValues["conta"]]
          const value = parseFloat(bankData[i][this.state.caixaColumnsValues["valor"]]).toFixed(2)
          const op_type = bankData[i][this.state.caixaColumnsValues["deb_Cred"]]
          // positive value indicate that is a income. negative is a expense.
          if(op_type === "C") {
            const extractObj = {title: objTitle, description: description, value: value, date:objDate, periodicity:"NONE", type: "Receita"}
            extractObjects.push(extractObj)

          }
           else {   
            const extractObj = {
              type: "Despesa",
              title: objTitle,
              description: description,
              date: objDate,
              periodicity: "NONE",
              value: value
            }

            extractObjects.push(extractObj)
          }
        }
      }
       return {extractObjects}
    }

    formatData = (data) => {
      const str = "/";
      return data.slice(0, 4) + str + data.slice(4, 6) + str + data.slice(6, 8);
    } 

    handleFiles = e => {
        let reader = new FileReader();
        reader.onload = function(e) {
            this.setState({file: reader.result})
        }.bind(this)
        reader.readAsText(e.target.files[0]);
    }

    handleClose() {
      this.setState({file:null, showFileModal: false, showExtractModal: false, extractObjects: [] });
    }
  
    handleShow() {
      this.setState({file:null, showFileModal: true });
    }

    handleList() {
      this.handleSubmit()
      this.setState({ showFileModal: false, showExtractModal: true })
    }
  
    render() {  
      return (
        <div>  
          <Button style={{float:"left"}} variant={"primary"} className={"text-center"}  onClick={this.handleShow}>
            Importar Extrato
          </Button>
          <ListExtract show={this.state.showExtractModal} onHide={this.handleClose} extractObjects={this.state.extractObjects}/>
          <Modal show={this.state.showFileModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Importe seu Extrato</Modal.Title>       
            </Modal.Header>
            <Modal.Body>
            <Alert bsStyle="warning">
                <strong>Importante!</strong> <br/>
                Atualmente apenas os bancos abaixo são suportados pelo Contare. Essa opção irá ler o arquivo
                de extrato disponibilizado pelo seu banco e criar automaticamente despesas/rendas de acordo com seu extrato.
            </Alert> 
            <Form>
                <FormGroup>
                    <ControlLabel>Selecione seu banco</ControlLabel>
                        <FormControl id="bankSelect" componentClass="select" placeholder="Bancos">
                            <option value="bb">Banco do Brasil</option>
                            <option value="caixa">Caixa Econômica Federal</option>
                        </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Selecione seu arquivo de extrato</ControlLabel>
                    <input type="file" onChange={this.handleFiles}/>
                </FormGroup>
            </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Fechar</Button>
              <Button onClick={this.handleList}  bsStyle="primary">Importar</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }
