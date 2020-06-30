import { REGISTRATION_MODAL_IS_OPEN,  REGISTRATION_MODAL_CLOSE } from './actions';


const defaultState = {
	modalIsOpen: false
};


export const modalReducer = (state = defaultState, action) => {
	switch (action.type) {
		case REGISTRATION_MODAL_IS_OPEN:
		   return { ...state,
								modalIsOpen: action.payload
							};

		case REGISTRATION_MODAL_CLOSE:
		   return { ...state, modalIsOpen: action.payload }
	}
	return state;

};
