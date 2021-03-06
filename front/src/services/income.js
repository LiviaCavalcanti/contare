import axios from 'axios'
import {notifyFailure, notifySucess} from './notifyService'
import {API_URL} from './index'

export function createIncome(title, description, value, date, periodicity, callback) {
    fetch(`${API_URL}/contare/user/incomes`, {
        method: 'POST',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token-contare"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title, description, value, receivedOn: date, periodicity
        })
    }).then(callback)
}

export async function createIncomeWithoutCallback(token, body, notify=false) {
    return await axios.post( `${API_URL}/contare/user/incomes`, body ,{headers: {Authorization : "Bearer " + token}})
     .then((response) => {
            if(notify) {
                notifySucess("Despesa adicionada com sucesso!")
            }
            return response;
       },
       (error) => {
           if(notify) {
            notifyFailure("Você já adicionou uma despesa com esse nome! Tente outro", error)
           }
           return false;
        }
     )
}

export function getIncomes() {
    return fetch(`${API_URL}/contare/user/incomes`, {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token-contare")
        }
    }).then(resp => resp.json())
}

export function updateIncome(id, title, description, value, date, periodicity, canceledDate, callback) {
    fetch(`${API_URL}/contare/user/incomes/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token-contare"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title, description, value, receivedOn: date, periodicity, canceledOn: canceledDate
        })
    })
}

export function deleteIncome(id) {
    fetch(`${API_URL}/contare/user/incomes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token-contare"),
            'Content-Type': 'application/json'
        }
    })
}
