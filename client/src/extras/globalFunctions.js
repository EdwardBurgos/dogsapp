import axios from 'axios';
import * as moment from 'moment';

export async function getTemperaments() {
    try {
        const temperaments = await axios.get('http://localhost:3001/temperament') 
        if (temperaments.status === 200) return temperaments.data
    } catch (e) {
        return []
    }
}

export function setLocalStorage(responseObj) {
    // Adds the expiration time defined on the JWT to the current moment
    const expiresAt = moment().add(Number.parseInt(responseObj.expiresIn), 'days');

    localStorage.setItem('token', responseObj.token);
    localStorage.setItem("expiration", JSON.stringify(expiresAt.valueOf()) );
}          

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
}

export function isLoggedIn() {
    return moment().isBefore(getExpiration(), "second");
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