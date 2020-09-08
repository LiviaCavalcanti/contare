import React, { useState } from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import { sendFriendRequest } from 'services/userService'
import { notifySucess, notifyFailure } from 'services/notifyService'

export default function AddFriend(props) {

    // State variables
    const [friendIdInput, setFriendIdInput] = useState('')

    // User Feedback
    const [showFriendIdAlert, setShowFriendIdAlert] = useState(false)

    function clearForm() {
        setFriendIdInput('')
        setShowFriendIdAlert(false)
    }

    async function validateFriendId(friendId) {
        if (friendId != null && friendId.length > 2) {
            setShowFriendIdAlert(false)
            return true;
        }
        return false;
    }

    async function submit() {
        if (validateFriendId(friendIdInput)) {
            sendFriendRequest(friendIdInput, localStorage.getItem("token-contare"))
            .then((response) => {
                notifySucess(`Usuário ${friendIdInput} adicionado!`);
            })
            .catch((error) => {
                notifyFailure(error.response.data);
            })
        } else {
            notifyFailure("Problema ao adicionar amigo(a)!");
        }
        setFriendIdInput("");
        props.setShow(false);
    }

    return (
        <Modal show={props.show} onHide={() => props.setShow(false) & clearForm()}>
            <Modal.Header closeButton>
                <Modal.Title>Adicionar Amigo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <ControlLabel>Nome de usuário (e-email) a ser adicionado(a)</ControlLabel>
                        <FormControl 
                            type="text"
                            value={friendIdInput}
                            onChange={val => setFriendIdInput(val.target.value) & validateFriendId(val.target.value)} style={showFriendIdAlert ? {borderColor: 'red', color: 'red'} : {}}
                            onKeyPress={event => {
                                if (event.key === "Enter" && !showFriendIdAlert) {
                                  submit();
                                }
                            }}/>
                        {showFriendIdAlert && <span style={{color: 'red'}}>Campo necessário para prosseguir</span>}
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={submit}>
                    Adicionar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
