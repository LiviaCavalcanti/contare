import { toast } from 'react-toastify';

export const notifySucess = (arg) => {
    console.log(arg)
    toast.success(arg, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export const notifyFailure = (arg) => {
    console.log(arg)
    toast.error(arg, {
        position: toast.POSITION.TOP_RIGHT
    });
}