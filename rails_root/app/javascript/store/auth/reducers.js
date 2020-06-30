import { USER_IS_LOGIN, ADMIN_IS_LOGIN, USER_IS_LOGOUT } from './actions';

const defaultState = {
  isAuth: false,
  user: null
};


export const authReducer = (state = defaultState, action) => {
  switch (action.type) {
  case USER_IS_LOGIN:
    return { ...state,
             isAuth: true,
             login: action.payload,
             userID: action.payload.id
           };

  case ADMIN_IS_LOGIN:
    return { ...state,
             isAuth: true,
             adminLogin: action.payload,
           };

  case USER_IS_LOGOUT:
    return { ...state, login: action.payload, isAuth: false }
  }
  return state;

};
