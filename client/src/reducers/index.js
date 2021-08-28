const initialState = {
  actualPage: [],
  finalResult: [],
  clickedNumber: 1,
  user: null
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
    default:
      return { ...state }
  }
}