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
            notifyFailure(error.response.data.error)
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
            notifyFailure(error.response.data.error)
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

export const verifyExpenses = async (token, callback) => {
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
            return response;
       },
       (error) => {
            //window.location.href = "/"
       }
     )
}