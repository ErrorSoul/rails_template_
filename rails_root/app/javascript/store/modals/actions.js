export const REGISTRATION_MODAL_IS_OPEN = 'REGISTRATION_MODAL_IS_OPEN';
export const REGISTRATION_MODAL_CLOSE = 'REGISTRATION_MODAL_CLOSE';


export const openModal = () => ({
	type: REGISTRATION_MODAL_IS_OPEN,
	payload: true
});

export const closeModal = () => ({
	type: REGISTRATION_MODAL_CLOSE,
	payload: false
});
