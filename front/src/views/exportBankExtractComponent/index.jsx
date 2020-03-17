import React from "react"
import {Modal, Button, Form, FormGroup, ControlLabel, FormControl, Alert} from "react-bootstrap"
import ReactFileReader from "react-file-reader"

export default class BankExtractModal extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleFiles = this.handleFiles.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  
      this.state = {
        show: false,
        file: null
      };
    }
  
    handleSubmit = () => {
        console.log(this.state.file)
    }

    handleFiles = e => {
        let reader = new FileReader();
        reader.onload = function(e) {
            this.setState({file: reader.result})
        }.bind(this)
        reader.readAsText(e.target.files[0]);
    }

    handleClose() {
      this.setState({ show: false });
    }
  
    handleShow() {
      this.setState({ show: true });
    }
  
    render() {  
      return (
        <div>  
          <Button style={{float:"left"}} variant={"primary"} className={"text-center"}  onClick={this.handleShow}>
            Importar Extrato
          </Button>
  
          <Modal show={this.state.show} onHide={this.handleClose}>
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
                        <FormControl componentClass="select" placeholder="Bancos">
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
              <Button onClick={this.handleSubmit}  bsStyle="primary">Exportar</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }