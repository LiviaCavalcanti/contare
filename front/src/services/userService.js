import axios from 'axios'
import {notifyFailure, notifySucess} from './notifyService'
import {API_URL} from './index'
import { Hash } from 'crypto'


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
        return error;
    }
    )
}

export const verifyUser = async (token, callback) => {
    axios.get( `${API_URL}/contare/user`, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        callback(response.data)
    },
    (error) => {
        window.location.href = "/register"
    }
    )
}

export const getUser = async (token) => {
    return axios.get( `${API_URL}/contare/user`, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        return (response.data)
    },
    (error) => {
        alert("Problema com o login!");
        window.location.href = "/register"
    }
    )
}

export const getAllEmail = async (token) => {
    return await axios.get( `${API_URL}/contare/user/getAll`, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        return response.data;
    },
    (error) => {
        return false;
        }
    )
}

export const updateUser = async (token, newUser, callback) => {
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

export const getUserFromID = async (id, token) => {
    console.log("Sending this ID to backend: %o", id);
    return axios.get( `${API_URL}/contare/user/${id}`, {userId: id},  {headers: {Authorization : "Bearer " + token}})
        .then((response) => {
            console.log("User received: %o", response.data);
            return response.data;
        })
        .catch((error) => {
            console.log("Erro no getUserFromID: ", error);
            return null;
        });
    }

export const addImage = async (token, imagePath, callback) => {
    let image = {
        url: imagePath,
    }
    axios.post(`${API_URL}/contare/user/image`, image, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        callback(response.data)
        return response.data;
    }).catch((error) => {
        return error;
    });
}

export const sendFriendRequest = async (friendId, token) => {
    if (token == null) { token = localStorage.getItem('token-contare') }
    let request = { friend: friendId }
    return axios.post(`${API_URL}/contare/user/friends`, request, {headers: {Authorization : "Bearer " + token}});
}

export const getFriends = async (token) => {
    if (token == null) { token = localStorage.getItem('token-contare') }
    return axios.get(`${API_URL}/contare/user/friends`, {headers: {Authorization : "Bearer " + token}});
}

export const deleteFriend = async (friendId, token) => {
    if (token == null) { token = localStorage.getItem('token-contare') }
    console.log('sending delete req with %o and token %s', friendId, token)
    let URL = `${API_URL}/contare/user/friends`
    return await axios.delete(URL, {
        headers: {
          Authorization: "Bearer " + token
        },
        data: {
            friend: friendId
        }
    })
    .then((response) => {
        notifySucess("Amizade deletada com sucesso!")
        return response;
    }, (error) => {
        notifyFailure(error.response.data.error)
        return false;
    })
}

export const acceptFriend = async (friendId, token) => {
    if (token == null) { token = localStorage.getItem('token-contare') }
    console.log('sending accept req with %o and token %s', friendId, token)
    let URL = `${API_URL}/contare/user/friendresponse`
    let body = {
        friend: friendId,
        accept: true
    }
    return await axios.post(URL, body, {headers: {Authorization: "Bearer " + token}})
    .then((response) => {
        notifySucess("Amizade deletada com sucesso!")
        return response;
    }, (error) => {
        notifyFailure(error.response.data.error)
        return false;
    })
}

export const refuseFriend = async (friendId, token) => {
    if (token == null) { token = localStorage.getItem('token-contare') }
    console.log('sending refuse req with %o and token %s', friendId, token)
    let URL = `${API_URL}/contare/user/friendresponse`
    let body = {
        friend: friendId,
        accept: false
    }
    return await axios.post(URL, body, {headers: {Authorization: "Bearer " + token}})
    .then((response) => {
        notifySucess("Amizade deletada com sucesso!")
        return response;
    }, (error) => {
        notifyFailure(error.response.data.error)
        return false;
    })
}

export const getSentFriendRequests = async (token) => {
    return axios.get( `${API_URL}/contare/user/sentFR`, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        console.log("sentFriendRequests: %o", response.data)
        return (response.data)
    })
}

export const getReceivedFriendRequests = async (token) => {
    return axios.get( `${API_URL}/contare/user/receivedFR`, {headers: {Authorization : "Bearer " + token}})
    .then((response) => {
        console.log(`receivedFriendRequests: ${response.data}`)
        return (response.data)
    })
}

export const cancelRequest = async (friendId, token) => {
    let URL = `${API_URL}/contare/user/cancelrequest`
    let body = {
        friend: friendId
    }
    return await axios.post(URL, body, {headers: {Authorization: "Bearer " + token}})
    .then((response) => {
        notifySucess("Requisição cancelada!")
        return response;
    }, (error) => {
        notifyFailure(error.response.data.error)
        return false;
    })
}
