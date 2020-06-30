export const USER_IS_LOGIN  = 'USER_IS_LOGIN';
export const USER_IS_LOGOUT = 'USER_IS_LOGOUT';
export const ADMIN_IS_LOGIN  = 'ADMIN_IS_LOGIN';



export const logIn = (login) => ({
	type: USER_IS_LOGIN,
	payload: login
});

export const adminLogIn = (login) => ({
	type: ADMIN_IS_LOGIN,
	payload: login
});

export const logOut = (login) => ({
	type: USER_IS_LOGOUT,
	payload: null
});
