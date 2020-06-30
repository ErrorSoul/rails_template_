import { NOTIK_USER_IS_LOGIN, NOTIK_USER_IS_LOGOUT, NOTIK_SHOW_MESSAGE } from './actions';

const defaultState = {
	showNotik: false,
	message: null
};


export const notikReducer = (state = defaultState, action) => {
	switch (action.type) {
		case NOTIK_USER_IS_LOGIN:
		   return {
				 ...state,
				 showNotik: true,
				 message: action.payload
			 };

	case NOTIK_SHOW_MESSAGE:
		return {
				...state,
			showNotik: !state.showNotik,
			message: action.payload
		};

		case NOTIK_USER_IS_LOGOUT:
		   return { ...state, showNotik: false, message: action.payload }
	}
	return state;

};
