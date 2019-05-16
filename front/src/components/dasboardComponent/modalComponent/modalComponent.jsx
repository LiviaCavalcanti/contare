import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


class ModalComponent extends Component {
    render() {
        return (
          <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {this.props.task.name} - {this.props.acao}
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
          </Modal>
        );
      }
}

export default ModalComponent;
