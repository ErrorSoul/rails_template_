export const NOTIK_USER_IS_LOGIN  = 'NOTIK_USER_IS_LOGIN';
export const NOTIK_USER_IS_LOGOUT = 'NOTIK_USER_IS_LOGOUT';
export const NOTIK_SHOW_MESSAGE = 'NOTIK_SHOW_MESSAGE';



export const notikLogIn = (message) => ({
	type: NOTIK_USER_IS_LOGIN,
	payload: message
});



export const notikNotik = (message) => ({
	type: NOTIK_SHOW_MESSAGE,
	payload: message
});

export const notikLogOut = (message) => ({
	type: NOTIK_USER_IS_LOGOUT,
	payload: message
});
