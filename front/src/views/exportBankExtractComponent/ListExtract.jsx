import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Table} from 'react-bootstrap';
import "./ListExtract.css"
import {addExpenses} from "../../services/expenseService"
import {notifySucess} from "../../services/notifyService"

export default class ListExtract extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleCheckbox=this.handleCheckbox.bind(this)
        this.state = {
          data: this.props.extractObjects,
          selectedData: [],
        }
    }

    async handleSubmit(){
      var createdExpenses = 0
      console.log(this.state.selectedData)
      for (var obj in this.state.selectedData) {
        console.log(obj)
        var retorno = await addExpenses(obj, function(){})
        if (retorno) {
          createdExpenses += 1
        }
      }
      if (createdExpenses > 0) {
        notifySucess("Foram criadas " + createdExpenses + " despesas")
      }
      else {
        notifySucess("Nenhuma despesa foi criada")
      }
      this.props.onHide()
    }

    handleCheckbox(event, obj1) {
      const {value, checked} = event.target; // get id and checked status
      var selectedData = this.state.selectedData.slice();
      
      // Add to an array if checked and remove - if uncheck
      if (checked) {
        selectedData.push(obj1);
      } else {
        selectedData = selectedData.filter(obj => obj !== obj1);
      }

      this.setState({ selectedData: selectedData });
    }
  
    render() {
      return (
        <Modal show={this.props.show}>
            <Modal.Header closeButton>
                <Modal.Title>Receitas e Despesas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
       
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "1%" }}></th>
                <th style={{ width: "25%" }}>Título</th>
                <th >Valor</th>
                <th className="acao" style={{ width: "15%" }}>Tipo</th>
                <th className="acao" style={{ width: "35%" }}>Descrição</th>
              </tr>
            </thead>
            <tbody>   
            {
              this.props.extractObjects.map((obj, i) => {
                return (
                  <tr key={`objects-${i}`}  className="mb-3">
                    <td><form>
                        <input onChange={(event)=>this.handleCheckbox(event, obj)} className="" type="checkbox" checked={this.state.selectedData.includes(obj)} type="checkbox"/>
                      </form>
                    </td>
                    <td>{obj.title}</td>
                    <td >{obj.value}</td>
                    <td>{obj.type}</td>
                    <td>{obj.description}</td>
                  </tr>
                )})
            }
            </tbody>
          </Table> 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Fechar</Button>
            <Button onClick={this.handleSubmit}  bsStyle="primary">Exportar</Button>
          </Modal.Footer>
        </Modal>
    )}
}