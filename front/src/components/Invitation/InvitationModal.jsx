import React from 'react';
import { Button, Modal } from 'react-bootstrap';


export default function InvitationModal(props){

    return(
       <Modal 
            show={props.isOpen} 
            onHide={()=>props.setShow()}
            bsSize="small"
            aria-labelledby="contained-modal-title-sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>Despesa: {props.invitation.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Você foi convidado por: {props.invitation.owner}</p>
                <p>{props.invitation.descricao}</p>
                <h4>R$ {props.invitation.value}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success" onClick={()=>props.accept(props.invitation._id) & props.setShow()}>Aceitar</Button>
                <Button bsStyle="danger" onClick={()=>props.reject(props.invitation._id) & props.setShow()}>Recusar</Button>
            </Modal.Footer>
       </Modal>
    );
}