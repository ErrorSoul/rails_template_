import { combineReducers } from 'redux';
import { modalReducer } from "./modals/reducers";
import { authReducer } from "./auth/reducers";
import { notikReducer } from "./notifications/reducers";
import { offerReducer } from "./offers/reducers";


export default combineReducers({
	modal: modalReducer,
	auth:  authReducer,
	notik: notikReducer,
	offer: offerReducer
});
