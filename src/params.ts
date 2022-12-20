export type Standings = {
	blook: string,
	name: string,
	place: number,
	corrects: {[index: number]: number},
	incorrects: {[index: number]: number}
};

export interface HistoryParams {
	standings: Standings[],
	settings: {
		instruct: boolean,
		type: string,
		amount: number,
		mode: string,
		lateJoin: boolean,
		randomNames: boolean,
		allowAccounts: boolean
	},
	set: string,
	setId: string
}


export interface SellBlookParams {
	blook: string,
	numSold: number,
	name: string
}

export interface BuyPackParams {
	box: string,
	name: string
}

export interface ChangeBlookParams {
	blook: string
}

export interface ChangeTitleParams {
	title: string
}

export interface ChangeBannerParams {
	banner: string
}

export interface CreateCustomBlookParams {
	blookIndex: number,
	customBlook: string
}

export interface LoginParams {
	name: string,
	password: string
}

