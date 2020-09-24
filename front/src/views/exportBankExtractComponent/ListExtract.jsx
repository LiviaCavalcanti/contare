import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Table} from 'react-bootstrap';
import "./ListExtract.css"
import {addExpenses} from "../../services/expenseService"
import {notifySucess} from "../../services/notifyService"
import {createIncomeWithoutCallback} from "../../services/income"

export default class ListExtract extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleCheckbox=this.handleCheckbox.bind(this)
        this.state = {
          data: this.props.extractObjects,
          selectedData: [],
        }
    }

    async handleSubmit(){
      let createdIncomes = 0
      let createdExpenses = 0
      
      this.state.selectedData.forEach(async function(obj, index){
        
        const token = localStorage.getItem("token-contare")
        let object2add = {title: obj.title, 
          description: obj.description, 
          periodicity: "NONE"}
        if (obj.type === "Receita"){
          object2add.receivedOn = obj.date
          object2add.value= obj.value
          let income = await createIncomeWithoutCallback(token, object2add)
          if (income.status == 200) createdIncomes += 1
        } else {
            object2add.category= obj.type
            object2add.description= obj.description
            object2add.dueDate = obj.date
            object2add.totalValue= obj.value
            let expense = await addExpenses(token, object2add)

          if (expense.status == 200) {
            createdExpenses += 1
          }
        }

        if (index == this.state.selectedData.length - 1) {
          if (createdExpenses > 0 || createdIncomes > 0) {
            notifySucess(`Foram criadas ${createdExpenses} despesas e ${createdIncomes} rendas.`)
          }
          else {
            notifySucess("Nenhum objeto foi criado")
          }
          this.props.onHide()
        }
    }.bind(this))

  }

    handleCheckbox(event, obj1) {
      const {value, checked} = event.target
      var selectedData = this.state.selectedData.slice()
      
      // Add to an array if checked and remove - if uncheck
      if (checked) {
        selectedData.push(obj1)
      } else {
        selectedData = selectedData.filter(obj => obj !== obj1)
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
       
          <Table >
            <thead>
              <tr>
                <th ></th>
                <th >Título</th>
                <th >Valor</th>
                <th className="acao" >Tipo</th>
                <th className="acao" >Descrição</th>
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
