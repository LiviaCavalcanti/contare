import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


class AdicionarTaskComponent extends Component {

  constructor(props) {
    super(props);

    console.log("wag props ", props);
  }

  render() {
    return (
      <div>

        <Modal.Header>
          <Modal.Title id="contained-modal-title-adicionar">
            Adicionar Nova Task
          </Modal.Title>
        </Modal.Header>
       
        <Modal.Body>
            Adicionar 
        </Modal.Body>
       
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Adicionar</Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </div>
    );
  }
}

export default AdicionarTaskComponent;
