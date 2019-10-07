import React, {useState} from "react"
import {Button, Grid, Row} from "react-bootstrap"
import CreateIncome from '../components/Income/CreateIncome'
import ListIncomes from '../components/Income/ListIncomes'

export default function() {
    const [showModal, setShowModal] = useState(false)
    const [updateList, SetUpdateList] = useState(true)

    return (
        <div className="content">
            <CreateIncome show={showModal} setShow={setShowModal} created={SetUpdateList} />
            <Grid fluid>
                <Row>
                    <Button variant={"primary"} className={"text-center"} onClick={() => setShowModal(true)}>
                        Adicionar Renda
                    </Button>
                </Row>
                <br/>
                <Row>
                    <ListIncomes update={updateList} setUpdate={SetUpdateList} />
                </Row>
            </Grid>
        </div>
    )
}
