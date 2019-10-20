import axios from 'axios'
import {notifyFailure, notifySucess} from './notifyService'
import {API_URL} from './index'


export const registerUser = async (name, email, pass, callback) => {
    const user = { name, email, password: pass }
    await axios.post(`${API_URL}/contare/register`, user)
        .then(function (response) {
            notifySucess(response.data.sucess)
            callback()
        })
        .catch(function (error) {
            notifyFailure('Ocorreu um problema no registro! Tente outras credenciais!')
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
            notifyFailure('Usuário ou senha não conferem!')
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
    console.log('uSER QUE CHEGA:', newUser)
    axios.post(`${API_URL}/contare/user/edit`, newUser, {headers: {"x-access-token" : token}})
    .then((response) => {
        callback(response.data)
      },
      (error) => {
         console.log(error)
      }
    )
}

export const getUserFromID = async (id, token, callback) => {
    return axios.get( `${API_URL}/contare/user/${id}`, {headers: {"x-access-token" : token}})
     .then((response) => {
        callback(response.data)
       },
       (error) => {

       }
     )
}
