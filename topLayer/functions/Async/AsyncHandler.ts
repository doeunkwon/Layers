import { type UserClothing } from '../../types/Clothing';
import {
	markedUserPictureProcessor,
	outfitClothingItemsPictureProcessor,
	userClothingArrayPictureProcessor,
	userClothingPictureProcessor,
} from '../../endpoints/General/Specialized/pictureProcessors';
import { type UserOutfit } from '../../types/Outfit';
import { type AsyncManager } from './AsyncManager';
import { type markedPrivateUser, type markedUser } from '../../types/User';

export const asyncHandlerOutfit = async (
	outfit: UserOutfit,
	asyncEmitter: AsyncManager
): Promise<void> => {
	const result = await outfitClothingItemsPictureProcessor(
		outfit.clothing_items
	);
	asyncEmitter.complete(outfit.oid);
};

export const asyncHandlerUserClothingArray = async (
	userClothingArray: UserClothing[],
	category: string,
	asyncEmitter: AsyncManager
): Promise<void> => {
	// console.log('arrays: ', userClothingArray);
	const result = await userClothingArrayPictureProcessor(userClothingArray);
	asyncEmitter.complete(category);
};

export const asyncHandlerUserClothing = async (
	userClothing: UserClothing,
	asyncEmitter: AsyncManager
): Promise<void> => {
	const result = await userClothingPictureProcessor(userClothing);
	asyncEmitter.complete(result.ciid);
};

export const asyncHandlerMarkedUser = async (
	user: markedUser | markedPrivateUser,
	asyncEmitter: AsyncManager
): Promise<void> => {
	const result = await markedUserPictureProcessor(user);
	asyncEmitter.complete(user.uid);
};
