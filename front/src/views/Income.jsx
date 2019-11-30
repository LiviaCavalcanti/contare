import React, {useState} from "react"
import {Button, Grid, Row} from "react-bootstrap"
import CreateIncome from '../components/Income/CreateIncome'
import ListIncomes from '../components/Income/ListIncomes'

export default function() {
    const [showModal, setShowModal] = useState(false)
    const [updateList, setUpdateList] = useState(true)
    const [totalIncome, setTotalIncome] = useState(0)

    return (
        <div className="content admin-flex-container-content">
            <CreateIncome show={showModal} setShow={setShowModal} created={setUpdateList} />
            <Grid fluid>
                <Row>
                    <Button variant={"primary"} className={"text-center"} onClick={() => setShowModal(true)}>
                        Adicionar Renda
                    </Button>
                    <span style={{float: "right"}}>
                        Total ganho: R$ {totalIncome}
                    </span>
                </Row>
                <br/>
                <Row>
                    <ListIncomes update={updateList} setUpdate={setUpdateList} setTotalIncome={setTotalIncome} />
                </Row>
            </Grid>
        </div>
    )
}
