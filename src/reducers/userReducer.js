import { GET_USER, LOGOUT_USER } from "../actions/types";


const userReducer = (state = false, action) => {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case LOGOUT_USER:
      return null;
    default:
      return state;
  }
};

export default userReducer;