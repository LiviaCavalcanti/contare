import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Table} from 'react-bootstrap';
import "./ListExtract.css"
import {addExpenses} from "../../services/expenseService"
import {notifySucess} from "../../services/notifyService"
import {createIncome} from "../../services/income"

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
      var createdExpenses = 0
      
      this.state.selectedData.forEach( async function(obj, index){
        
        const token = localStorage.getItem("token-contare")
        console.log(token, obj)

        if (obj.type === "Receita"){
          console.log("here")
          var retorno = await createIncome( obj.title, obj.description, obj.value, obj.date, "NONE", function(){})
          
          console.log(retorno)

          if (retorno) {
            console.log("tem retorno")
            createdExpenses += 1
          }
          console.log(retorno)
        } else {
          console.log("here gasto")
          var retorno = await addExpenses(token, {
            category: obj.type,
            title: obj.title,
            description: obj.description,
            dueDate: obj.date,
            periodicity: "NONE",
            totalValue: obj.value
          }, function(){})

          if (retorno) {
            createdExpenses += 1
          }
        }
        
      }
        
      )
      
      if (createdExpenses > 0) {
        notifySucess("Foram criadas " + createdExpenses + " despesas")
      }
      else {
        notifySucess("Nenhuma despesa foi criada")
      }
      this.props.onHide()
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
