import axios from '../axiosInterceptor';
import * as moment from 'moment';

export async function getTemperaments() {
    try {
        const temperaments = await axios.get('http://localhost:3001/temperaments')
        if (temperaments.status === 200) return temperaments.data
    } catch (e) {
        return []
    }
}

export function setLocalStorage(responseObj) {
    // Adds the expiration time defined on the JWT to the current moment
    const expiresAt = moment().add(Number.parseInt(responseObj.expiresIn), 'days');

    localStorage.setItem('token', responseObj.token);
    localStorage.setItem("expiration", JSON.stringify(expiresAt.valueOf()));
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
}

export function isLoggedIn() {
    // if (!Object.keys(await getUserInfo()).length) { logout(); return false; }
    // return true


    // getUserInfo().then(response => {
    //     if (!Object.keys(response).length) { logout(); return false; }
    //     return true
    // })
 

    return moment().isBefore(getExpiration(), "second");
}

export async function getUserInfo() {
    if (localStorage.getItem("token") && localStorage.getItem("expiration")) {
        try {
            const infoReq = await axios.get('/users/info')
            if (infoReq.status === 200) {
                return infoReq.data.user
            } else { return {} }
        } catch (e) { return {} }
    } else { return {} }
}

export function isLoggedOut() {
    return !this.isLoggedIn();
}

export function getExpiration() {
    const expiration = localStorage.getItem("expiration");
    if (expiration) {
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    } else {
        return moment();
    }
}