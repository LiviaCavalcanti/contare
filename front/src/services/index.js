import axios from 'axios';
import { toast } from 'react-toastify';


export const API_URL = process.env.REACT_APP_API_URL


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
           notifyFailure("Você já adicionou uma despesa com esse nome! Tente outro")
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

export const getAllInvitations = async (token, callback) => {
    return await axios.get( `${API_URL}/contare/user/invitations` ,{headers: {"x-access-token" : token}})
    .then((response) => {
        callback(response.data)
    },
    (error) => {
        callback(error)
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

export const getUserFromID = async (id, token, callback) => {
    return axios.get( `${API_URL}/contare/user/${id}`, {headers: {"x-access-token" : token}})
     .then((response) => {
        callback(response.data)
       },
       (error) => {

       }
     )
}

export const acceptInviteReq = async (inviteID, token) => {

    const inviteObj = {
        invitationId: inviteID
    }

    return axios.put( `${API_URL}/contare/user/invitations`, inviteObj , {headers: {"x-access-token" : token}})
     .then((response) => {
        notifySucess(response.data)
       },
       (error) => {
        notifyFailure('Erro ao aceitar convite, tente novamente mais tarde!')
       }
     )
}

export const rejectInviteReq = async (inviteID, token) => {

    const inviteObj = {
        invitationId: inviteID
    }

    return axios.post(`${API_URL}/contare/user/invitations`, inviteObj , {headers: {"x-access-token" : token}})
     .then((response) => {
        notifySucess(response.data)
       },
       (error) => {
        notifyFailure('Erro ao rejeitar convite, tente novamente mais tarde!')
       }
     )
}