import {StatsCard} from "components/StatsCard/StatsCard.jsx"
import React, {useState, useEffect} from 'react'
import {getIncomes} from '../../services/income'
import Income from './Income'

export default function ListIncomes(props) {
    const [incomes, setIncomes] = useState([])
    const [incomeModals, setIncomeModals] = useState([])

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)
            getIncomes().then(resp => {
                setIncomes(resp)
                setIncomeModals(resp.map(_ => false))
            })
        }
    })

    function showModal(i) {
        let incModals = incomeModals.slice()
        incModals[i] = true
        setIncomeModals(incModals)
    }

    return incomes.map((income, i) =>
        <div key={income._id}>
            <StatsCard bigIcon={<i className="pe-7s-server text-warning" />}
                statsText={income.title}
                statsValue={"R$ " + income.value}
                statsIcon={<i className="fa fa-edit" onClick={() => showModal(i)} />}
                statsIconText={<span onClick={() => showModal(i)}>Editar renda</span>}
            />
            <Income income={income} i={i} incomeModals={incomeModals} setIncomeModals={setIncomeModals} setUpdate={props.setUpdate} />
        </div>
    )
}
