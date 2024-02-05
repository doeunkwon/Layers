import {
	AsyncManager,
	type resolutionType,
} from '../../../functions/Async/AsyncManager';
import {
	type outfitClothingItemsType,
	type UserOutfit,
} from '../../../types/Outfit';
import {
	type markedPrivateUser,
	type markedUser,
	type User,
} from '../../../types/User';
import { pictureProcessor } from '../pictureProcessor';
import {
	asyncHandlerMarkedUser,
	asyncHandlerOutfit,
	asyncHandlerUserClothing,
	asyncHandlerUserClothingArray,
} from '../../../functions/Async/AsyncHandler';
import { type UserClothing } from '../../../types/Clothing';

export const markedUsersPictureProcessor = async (
	users: Array<markedUser | markedPrivateUser>
): Promise<Array<markedUser | markedPrivateUser>> => {
	const asyncManager = new AsyncManager(users.length);
	// Create a promise that will be resolved or rejected based on the 'proceed' event
	const asyncTrigger = new Promise<void>((resolve, reject) => {
		// Listener function that we will add to the emitter
		const listener = (resolution: resolutionType): void => {
			if (resolution[1] < 0) {
				reject(new Error('Some Url Download Requests Failed'));
			} else {
				resolve();
			}
			// Remove the listener after it's called to mimic 'once' behavior
			asyncManager.removeAllListeners('proceed');
		};

		// Add the listener to the 'proceed' event
		asyncManager.addListener('proceed', listener);
	});
	for (const user of users) {
		void asyncHandlerMarkedUser(user, asyncManager);
	}
	await asyncTrigger;
	return users;
};

export const markedUserPictureProcessor = async (
	user: markedUser | markedPrivateUser
): Promise<markedUser | markedPrivateUser> => {
	const profile_picture = await pictureProcessor(
		user.profile_picture,
		user.uid
	);
	user.profile_picture = profile_picture;
	return user;
};

export const userPictureProcessor = async (user: User): Promise<User> => {
	const profile_picture = await pictureProcessor(
		user.profile_picture,
		user.uid
	);
	user.profile_picture = profile_picture;
	return user;
};

export const outfitPictureProcessor = async (
	outfits: UserOutfit[]
): Promise<UserOutfit[]> => {
	const asyncManager = new AsyncManager(outfits.length);
	// Create a promise that will be resolved or rejected based on the 'proceed' event
	const asyncTrigger = new Promise<void>((resolve, reject) => {
		// Listener function that we will add to the emitter
		const listener = (resolution: resolutionType): void => {
			if (resolution[1] < 0) {
				reject(new Error('Some Url Download Requests Failed'));
			} else {
				resolve();
			}
			// Remove the listener after it's called to mimic 'once' behavior
			asyncManager.removeAllListeners('proceed');
		};

		// Add the listener to the 'proceed' event
		asyncManager.addListener('proceed', listener);
	});
	for (const outfit of outfits) {
		console.log('outfit: ', outfit);
		void asyncHandlerOutfit(outfit, asyncManager);
	}
	await asyncTrigger;
	return outfits;
};

export const outfitClothingItemsPictureProcessor = async (
	outfitClothingItems: outfitClothingItemsType
): Promise<outfitClothingItemsType> => {
	const asyncManager = new AsyncManager(
		Object.keys(outfitClothingItems).length
	);
	// Create a promise that will be resolved or rejected based on the 'proceed' event
	const asyncTrigger = new Promise<void>((resolve, reject) => {
		// Listener function that we will add to the emitter
		const listener = (resolution: resolutionType): void => {
			if (resolution[1] < 0) {
				reject(new Error('Some Url Download Requests Failed'));
			} else {
				resolve();
			}
			// Remove the listener after it's called to mimic 'once' behavior
			asyncManager.removeAllListeners('proceed');
		};

		// Add the listener to the 'proceed' event
		asyncManager.addListener('proceed', listener);
	});

	for (const category of Object.keys(outfitClothingItems)) {
		void asyncHandlerUserClothingArray(
			outfitClothingItems[category],
			category,
			asyncManager
		);
	}
	await asyncTrigger;
	return outfitClothingItems;
};

export const userClothingArrayPictureProcessor = async (
	userClothingArray: UserClothing[]
): Promise<UserClothing[]> => {
	if (userClothingArray.length === 0) {
		return userClothingArray;
	}
	const asyncManager = new AsyncManager(userClothingArray.length);
	// Create a promise that will be resolved or rejected based on the 'proceed' event
	const asyncTrigger = new Promise<void>((resolve, reject) => {
		// Listener function that we will add to the emitter
		const listener = (resolution: resolutionType): void => {
			if (resolution[1] < 0) {
				reject(new Error('Some Url Download Requests Failed'));
			} else {
				resolve();
			}
			// Remove the listener after it's called to mimic 'once' behavior
			asyncManager.removeAllListeners('proceed');
		};

		// Add the listener to the 'proceed' event
		asyncManager.addListener('proceed', listener);
	});

	for (const userClothing of userClothingArray) {
		void asyncHandlerUserClothing(userClothing, asyncManager);
	}
	await asyncTrigger;
	return userClothingArray;
};

export const userClothingPictureProcessor = async (
	userClothing: UserClothing
): Promise<UserClothing> => {
	const image_url = await pictureProcessor(
		userClothing.image_url,
		userClothing.ciid
	);
	userClothing.image_url = image_url;
	return userClothing;
};
