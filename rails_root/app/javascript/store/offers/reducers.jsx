import { OFFER_TITLE_CHANGE, OFFER_CASHBACK_CHANGE  } from './actions';

const defaultState = {
	title: ''
};


export const offerReducer = (state = defaultState, action) => {
	switch (action.type) {
	case  OFFER_TITLE_CHANGE:
		   return {
					 ...state,
				   title: action.payload
			 };

	case  OFFER_CASHBACK_CHANGE:
		   return {
					 ...state,
				   cashback: action.payload
			 };
	}
	return state;

};
