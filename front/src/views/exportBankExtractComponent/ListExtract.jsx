import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Table } from 'react-bootstrap';

export default class ListExtract extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          data: this.props.extractObjects
        }
    }

    handleSubmit(){
      // fechar o modal de baixo
      // notifySucess("Foram criadas " + objValues["createdExpenses"] + " despesas e " + objValues["createdIncomes"]+ " rendas!")
      this.props.handleClose()
    }

    render() {
      let partners = this.props && this.props.extractObjects.length > 0 ?
      this.props.extractObjects.map( (obj, i)=>
        <tr key={`objects-${i}`}>
        <td >
          {obj.title}
        </td>
        <td >
          {obj.value}
        </td>
        <td>
          {obj.type}
        </td>
        <td>
          {obj.description}
        </td>
      </tr>
      ) : <tr></tr>;
      return (
        <Modal show={this.props.show}>
            <Modal.Header closeButton>
                <Modal.Title>Receitas e Despesas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
            <Table striped bordered hover>
            {/* <thead>
              <tr>
                <th style={{ width: "25%" }}>Nome</th>
                <th style={{ width: "25%" }}>Email</th>
                <th >Valor</th>
                <th className="acao" style={{ width: "20%" }}>Status</th>
                <th className="acao" style={{ width: "20%" }}>Status Convite</th>
              </tr>
            </thead> */}
            <tbody>
            {
                this.props.extractObjects.map((obj, i) => {
                  return (
                    <tr key={`objects-${i}`}>
                      <td >
                        {obj.title}
                      </td>
                      <td >
                        {obj.value}
                      </td>
                      <td>
                        {obj.type}
                      </td>
                      <td>
                        {obj.description}
                      </td>
                    </tr>

                  )
                })
              }
            </tbody>
            </Table>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={this.props.handleClose}>Fechar</Button>
              <Button onClick={this.handleSubmit}  bsStyle="primary">Exportar</Button>
            </Modal.Footer>
        </Modal>
    )}
}