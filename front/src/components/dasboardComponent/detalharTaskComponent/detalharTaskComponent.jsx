import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


class DetalharTaskComponent extends Component {

    constructor(props){
      super(props);

      console.log("wag props ", props);
    }

    render() {
        return (
          <div>

            <Modal.Header >
              <Modal.Title id="contained-modal-title-detalhe">
                {this.props.task.name} - Detalhe
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Detalhar a task  {this.props.task.name}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
          </div>
        );
      }
}

export default DetalharTaskComponent;
