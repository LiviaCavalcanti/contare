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
     axios.get( `${API_URL}/contare/user`, {headers: {Authorization : "Bearer " + token}})
      .then((response) => {
          window.location.href = "/dashboard"
        },
        (error) => {
        }
      )
}

export const verifyUser = async (token, callback) => {
    axios.get( `${API_URL}/contare/user`, {headers: {Authorization : "Bearer " + token}})
     .then((response) => {
         callback(response.data)
       },
       (error) => {
            //window.location.href = "/"
       }
     )
}

export const getUser = async (token) => {
    console.log("Inside getUser function. Received this token: ", token);
    return axios.get( `${API_URL}/contare/user`, {headers: {Authorization : "Bearer " + token}})
     .then((response) => {
         return (response.data)
       },
       (error) => {
           alert("Trouble with user retrieval!");
            // window.location.href = "/register"
       }
     )
}

export const getAllEmail = async (token) => {
    return await axios.get( `${API_URL}/contare/user/getAll` ,{headers: {Authorization : "Bearer " + token}})
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
    axios.post(`${API_URL}/contare/user/edit`, newUser, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        console.log("update user post req came back with this obj: %o", response);
        callback(response.data)
      },
      (error) => {
         console.log("Response came back, but got this error: ", error)
      }
    ).catch((error) => {
        console.log("Deu algum erro... This is what I know: ", error);
    })
}

export const getUserFromID = async (id, token, callback) => {
    return axios.get( `${API_URL}/contare/user/${id}`, {headers: {Authorization : "Bearer " + token}})
     .then((response) => {
        callback(response.data)
       },
       (error) => {
       }
     )
}
