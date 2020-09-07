import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'

export default class ListExtract extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show
        }
    }

    render() {return (
        <Modal show={this.state.show}>
            <Modal.Header closeButton>
                <Modal.Title>Receitas e Despesas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            extractObjects
            {/* {
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
              } */}
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" >
                    Adicionar
                </Button>
            </Modal.Footer>
        </Modal>
    )}
}