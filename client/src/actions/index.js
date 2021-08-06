import axios from 'axios'; // Esta librería también es necesaria para hacer el request al servidor

export function getUserLoged() {

}

export function modificarUsuarioLogueado() {

}

export function setLoginOrNot() {
    return {
        type: 'SET_LOGIN_OR_NOT',
        login: true
    }
}

export function setClickedNumber(clickedNumber) {
    return {
        type: 'SET_CLICKED_NUMBER',
        clickedNumber
    }
}

export function receiveDogs(dogs) {
    return {
        type: 'RECEIVE_DOGS',
        dogs
    }
}

export function receiveFullDogs(dogs) {
    return {
        type: 'RECEIVE_FULL_DOGS',
        dogs
    }
}

export function changePage(actualPage) {
    return {
        type: 'CHANGE_PAGE',
        actualPage
    }
}

export function receiveTemperaments(temperaments) {
    return {
        type: 'RECEIVE_TEMPERAMENTS',
        temperaments
    }
}

export function deleteCreationMessage() {
    return {
        type: 'DELETE_CREATION_MESSAGE'
    }
}
export function saveCreationMessage(message) {
    return {
        type: 'SAVE_CREATION_MESSAGE',
        message
    }
}

export function modifyFinalResult(finalResult) {
    return {
        type: 'MODIFY_FINAL_RESULT',
        finalResult
    }
}

export function axiosDogs() {
    return async function (dispatch) {
        try {
            const response = await axios.get('http://localhost:3001/dogs') 
            dispatch(receiveDogs(response.data))
            const responseDos = await axios.get('http://localhost:3001/dogs/all') 
            dispatch(receiveDogs(responseDos.data))
        } catch (e) {
            console.log(e);
        }
    }
}

export function axiosFullDogs() {
    return async function (dispatch) {
        try {
            const response = await axios.get('http://localhost:3001/dogs/all') 
            dispatch(receiveFullDogs(response.data))
        } catch (e) {
            console.log(e);
        }
    }
}

export function axiosTemperaments() {
    return async function (dispatch) {
        try {
            const response = await axios.get('http://localhost:3001/temperament') 
            dispatch(receiveTemperaments(response.data))
        } catch (e) {
            console.log(e);
        }
    }
}
