import React, {useState} from "react"
import {Button, Grid, Row} from "react-bootstrap"
import CreateExpense from '../components/Expenses/CreateExpense'
import ListExpenses from '../components/Expenses/ListExpenses'
import BankExtractModal from '../views/exportBankExtractComponent/index'

export default function() {
    const [showModal, setShowModal] = useState(false)
    const [updateList, setUpdateList] = useState(true)
    const [totalExpense, setTotalExpense] = useState(0)

    return (
        <div className="content admin-flex-container-content">
            <CreateExpense show={showModal} setShow={setShowModal} created={setUpdateList} />
            <Grid fluid>
                <Row>
                    <Button style={{float:"left", marginRight: "10px"}} variant={"primary"} className={"text-center"} onClick={() => setShowModal(true)}>
                        Adicionar Gasto
                    </Button>
                    <BankExtractModal/>
                    <span style={{float: "right"}}>
                        Total gasto: {totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
