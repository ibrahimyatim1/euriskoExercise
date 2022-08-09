import { GET_USER, LOGOUT_USER } from './types';

export const SetUser = (user) => async (dispatch) => {
    dispatch({ type: GET_USER, payload: user });
};

export const logoutUser = () => async (dispatch) => {
    dispatch({ type: LOGOUT_USER });
};
