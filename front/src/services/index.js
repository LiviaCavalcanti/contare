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
            //console.log("USER LOGADO ", response.data.user);
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
          console.log(error.data)
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