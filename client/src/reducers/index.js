const initialState = {
  login: true,
  dogs: [],
  temperaments: [],
  creationMessage: '',
  actualPage: [],
  finalResult: [],
  clickedNumber: 1
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'MODIFY_FINAL_RESULT':
      return {
        ...state,
        finalResult: action.finalResult
      }
    case 'RECEIVE_DOGS':
      return {
        ...state,
        dogs: action.dogs,
      }
    case 'CHANGE_PAGE':
      return {
        ...state,
        actualPage: action.actualPage
      }
    case 'RECEIVE_FULL_DOGS':
      return {
        ...state,
        dogs: action.dogs,
      }
    case 'RECEIVE_TEMPERAMENTS':
      return {
        ...state,
        temperaments: action.temperaments
      }
    case 'SAVE_CREATION_MESSAGE':
      return {
        ...state,
        creationMessage: action.message
      }
    case 'DELETE_CREATION_MESSAGE':
      return {
        ...state,
        creationMessage: ''
      }
    case 'SET_CLICKED_NUMBER':
      return {
        ...state,
        clickedNumber: action.clickedNumber
      }
    default:
      return { ...state }
  }
}