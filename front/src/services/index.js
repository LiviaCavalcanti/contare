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
            console.log("USER LOGADO ", response.data.user);
        })
        .catch(function (error) {
            notifyFailure(error.response.data.error)
        })
}