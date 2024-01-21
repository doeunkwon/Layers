export interface User {
	uid: string;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	private_option: boolean;
	followers: string[];
	following: string[];
	profile_picture: string;
}

export interface retrievedUser {
	uid: string;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	private_option: boolean;
	followers: string[];
	following: string[];
	profile_picture: ArrayBuffer;
}

export interface formUser {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
	private_option: boolean;
	profile_picture: string;
}

export interface loginUser {
	email: string;
	password: string;
}

export interface markedUser extends User {
	marked: boolean;
}

export interface privateUser {
	uid: string;
	username: string;
	first_name: string;
	last_name: string;
	private_option: boolean;
	profile_picture: string;
}

export interface markedPrivateUser extends privateUser {
	marked: boolean;
}

export const isUser = (obj: any): obj is User => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		obj !== undefined &&
		typeof obj?.uid === 'string' &&
		typeof obj?.first_name === 'string' &&
		typeof obj?.last_name === 'string' &&
		typeof obj?.email === 'string' &&
		typeof obj?.username === 'string' &&
		typeof obj?.private_option === 'boolean' &&
		Array.isArray(obj.followers) &&
		Array.isArray(obj.following) &&
		typeof obj?.profile_picture === 'string'
	);
};

export const isRetrievedUser = (obj: any): obj is retrievedUser => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		obj !== undefined &&
		typeof obj?.uid === 'string' &&
		typeof obj?.first_name === 'string' &&
		typeof obj?.last_name === 'string' &&
		typeof obj?.email === 'string' &&
		typeof obj?.username === 'string' &&
		typeof obj?.private_option === 'boolean' &&
		Array.isArray(obj.followers) &&
		Array.isArray(obj.following) &&
		typeof obj?.profile_picture === 'object' &&
		Buffer.isBuffer(obj.profile_picture)
	);
};

export const isMarkedUser = (
	obj: any
): obj is markedUser | markedPrivateUser => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		obj !== undefined &&
		typeof obj?.uid === 'string' &&
		typeof obj?.first_name === 'string' &&
		typeof obj?.last_name === 'string' &&
		typeof obj?.username === 'string' &&
		typeof obj?.private_option === 'boolean' &&
		typeof obj?.profile_picture === 'string' &&
		typeof obj?.marked === 'boolean'
	);
};

export const isPrivateUser = (
	obj: any
): obj is markedPrivateUser | privateUser => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		obj !== undefined &&
		typeof obj?.uid === 'string' &&
		typeof obj?.first_name === 'string' &&
		typeof obj?.last_name === 'string' &&
		typeof obj?.username === 'string' &&
		typeof obj?.private_option === 'boolean' &&
		typeof obj?.profile_picture === 'string' &&
		obj.private_option === true
	);
};

export const isAnyUser = (
	obj: any
): obj is
	| markedPrivateUser
	| privateUser
	| User
	| markedUser
	| retrievedUser => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		obj !== undefined &&
		typeof obj?.uid === 'string' &&
		typeof obj?.first_name === 'string' &&
		typeof obj?.last_name === 'string' &&
		typeof obj?.username === 'string' &&
		typeof obj?.private_option === 'boolean' &&
		typeof obj?.profile_picture === 'string'
	);
};

export const isAnyUserArray = (arr: any[]): arr is User[] => {
	return arr.every((item) => isAnyUser(item));
};

export const isMarkedUserArray = (
	arr: any[]
): arr is Array<markedUser | markedPrivateUser> => {
	return arr.every((item) => isMarkedUser(item));
};
