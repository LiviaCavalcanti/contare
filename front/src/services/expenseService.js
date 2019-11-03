import axios from 'axios'
import {notifyFailure, notifySucess} from './notifyService'
import {API_URL} from './index'


export const getExpenses = async (token) => {
    // console.log("chamou getExpense ", token);
    return await axios.get( `${API_URL}/contare/user/expenses`, {headers: {Authorization : "Bearer " + token}})
     .then((response) => {
        //  console.log("response ------------ ", response);
         return response.data;
        },
        (error) => {
            // console.log("erro ao solicitar gastos: ", error);
            return error;
       }
     )
}

export const addExpenses = async (token, body) => {
    return await axios.post( `${API_URL}/contare/user/expenses`, body ,{headers: {Authorization : "Bearer " + token}})
     .then((response) => {
            notifySucess("Despesa adicionada com sucesso!")
            return response;
       },
       (error) => {
           notifyFailure("Você já adicionou uma despesa com esse nome! Tente outro")
           return false;
        }
     )
}

export const deleteExpense = async (token, id) => {
    return await axios.delete( `${API_URL}/contare/user/expenses/${id}`, {headers: {Authorization : "Bearer " + token}})
     .then((response) => {
            notifySucess("Despesa deletada com sucesso!")
            return response;
       },
       (error) => {
           notifyFailure(error.response.data.error)
           return false;
        }
     )
}

export const updateExpenses = async (token, id, body) => {
    return await axios.put( `${API_URL}/contare/user/expenses/${id}`, body ,{headers: {Authorization : "Bearer " + token}})
     .then((response) => {
            notifySucess("Despesa alterada com sucesso!")
            return response;
       },
       (error) => {
           notifyFailure(error.response.data.error)
           return false;
        }
     )
}

export const getExpense = async (id, callback) => {
    return await axios.get( `${API_URL}/contare/user/expenses/${id}`)
    .then((response) => {
        callback(response.data)
    },
    (error) => {
        //DO SOMETHING
        }
     )
}