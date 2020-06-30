export const  OFFER_TITLE_CHANGE  = 'OFFER_TITLE_CHANGE';
export const  OFFER_CASHBACK_CHANGE  = 'OFFER_CASHBACK_CHANGE';


export const updateTitle = (title) => ({
	type: OFFER_TITLE_CHANGE,
	payload: title
});



export const updateCashback = (cashback) => ({
	type: OFFER_CASHBACK_CHANGE,
	payload: cashback
});
