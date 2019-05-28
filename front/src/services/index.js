import axios from 'axios';
import { toast } from 'react-toastify';


export const API_URL = "http://localhost:8080"


export const notifySucess = (arg) => {
    toast.success(arg, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export const notifyFailure = (arg) => {
    toast.error(arg, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export const registerUser = async (name, email, pass) => {
    const user = { name, email, password: pass }
    await axios.post(`${API_URL}/contare/register`, user)
        .then(function (response) {
            notifySucess(response.data.sucess)
        })
        .catch(function (error) {
            notifyFailure('Ocorreu um erro inesperado, tente novamente!')
        })
}

export const login = async (email, password) => {
    const user = { email, password }
    await axios.post(`${API_URL}/contare/authenticate`, user)
        .then(function (response) {
            localStorage.setItem('token-contare', response.data.token);
            window.location.href = "/dashboard"
        })
        .catch(function (error) {
            notifyFailure('Ocorreu um erro inesperado, tente novamente!')
        })
}

export const redirectLoggedUser = async (token) => {
     axios.get( `${API_URL}/contare/user`, {headers: {"x-access-token" : token}})
      .then((response) => {
          window.location.href = "/dashboard"
        },
        (error) => {
        }
      )
}

export const verifyUser = async (token, callback) => {
    axios.get( `${API_URL}/contare/user`, {headers: {"x-access-token" : token}})
     .then((response) => {
         callback(response.data)
       },
       (error) => {
            //window.location.href = "/"
       }
     )
}

export const getUser = async (token) => {
    return axios.get( `${API_URL}/contare/user`, {headers: {"x-access-token" : token}})
     .then((response) => {
         return (response.data)
       },
       (error) => {
            //window.location.href = "/"
       }
     )
}

export const getExpenses = async (token, callback) => {
    return await axios.get( `${API_URL}/contare/user/expenses`, {headers: {"x-access-token" : token}})
     .then((response) => {
            return response.data;
       },
       (error) => {
            return error;
       }
     )
}

export const addExpenses = async (token, body) => {
    return await axios.post( `${API_URL}/contare/user/expenses`, body ,{headers: {"x-access-token" : token}})
     .then((response) => {
            notifySucess("Despesa adicionada com sucesso!")
            return response;
       },
       (error) => {
           notifyFailure(error.response.data.error)
           return false;
        }
     )
}

export const deletedExpenses = async (token, id) => {
    return await axios.delete( `${API_URL}/contare/user/expenses/${id}`, {headers: {"x-access-token" : token}})
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
    return await axios.put( `${API_URL}/contare/user/expenses/${id}`, body ,{headers: {"x-access-token" : token}})
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

export const getAllEmail = async (token) => {
    return await axios.get( `${API_URL}/contare/user/getAll` ,{headers: {"x-access-token" : token}})
    .then((response) => {
        return response.data;
    },
    (error) => {
           return false;
        }
     )
}

export const updateUser = async (token, newUser, callback) => {
    console.log(token)
    axios.put( `${API_URL}/contare/user`, newUser, {headers: {"x-access-token" : token}})
    .then((response) => {
        callback(response.data)
      },
      (error) => {
         
      }
    )
}