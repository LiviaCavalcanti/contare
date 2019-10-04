import {StatsCard} from "components/StatsCard/StatsCard.jsx"
import React, {useState, useEffect} from 'react'
import {getIncomes} from '../../services/income'

export default function ListIncomes(props) {
    const [incomes, setIncomes] = useState([])
    window.incomes = incomes

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)
            getIncomes().then(resp => setIncomes(resp))
        }
    })
    return incomes.map(income => 
        <StatsCard bigIcon={<i className="pe-7s-server text-warning" />}
            statsText={income.title}
            statsValue={"R$ " + income.value}
            statsIcon={<i className="fa fa-edit" />}
            statsIconText="Editar renda"
        />
    )
}
