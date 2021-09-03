const initialState = {
  actualPage: [],
  finalResult: [],
  clickedNumber: 1,
  user: null,
  publicUser: {},
  dog: {}
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'MODIFY_FINAL_RESULT':
      return {
        ...state,
        finalResult: action.finalResult
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.user
      }
    case 'CHANGE_PAGE':
      return {
        ...state,
        actualPage: action.actualPage
      }
    case 'SET_CLICKED_NUMBER':
      return {
        ...state,
        clickedNumber: action.clickedNumber
      }
    case 'SET_PUBLIC_USER':
      return {
        ...state,
        publicUser: action.publicUser
      }
    case 'SET_CURRENT_DOG':
      return {
        ...state,
        dog: action.dog
      }
    default:
      return { ...state }
  }
}