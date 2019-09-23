import {API_URL} from './index'
import axios from 'axios'
import {notifyFailure, notifySucess} from './notifyService.js';

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