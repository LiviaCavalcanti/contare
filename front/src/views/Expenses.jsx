import React, {useState} from "react"
import {Button, Grid, Row} from "react-bootstrap"
import CreateExpense from '../components/Expenses/CreateExpense'
import ListExpenses from '../components/Expenses/ListExpenses'

export default function() {
    const [showModal, setShowModal] = useState(false)
    const [updateList, setUpdateList] = useState(true)
    const [totalExpense, setTotalExpense] = useState(0)

    return (
        <div className="content admin-flex-container-content">
            <CreateExpense show={showModal} setShow={setShowModal} created={setUpdateList} />
            <Grid fluid>
                <Row>
                    <Button variant={"primary"} className={"text-center"} onClick={() => setShowModal(true)}>
                        Adicionar Gasto
                    </Button>
                    <span style={{float: "right"}}>
                        Total gasto: R$ {totalExpense}
                    </span>
                </Row>
                <br/>
                <Row>
                    <ListExpenses update={updateList} setUpdate={setUpdateList} setTotalExpense={setTotalExpense} />
                </Row>
            </Grid>
        </div>
    )
}
