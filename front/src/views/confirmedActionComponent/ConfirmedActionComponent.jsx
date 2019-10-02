import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import {Button} from 'react-bootstrap'

import ConfirmedActionStyled from './styled';



class ConfirmedActionComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ConfirmedActionStyled>
          <Modal.Body> 
            {this.props.acao}
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.confirmar}>Sim</Button>
            <Button onClick={this.props.cancelar}>Não</Button>
          </Modal.Footer>
      </ConfirmedActionStyled>
    );
  }
}

export default ConfirmedActionComponent;
