import { type outfitClothingItemsType, type UserOutfit } from '../types/Outfit';
import { type UserClothing } from '../types/Clothing';
import { endpoint } from './General/endpoint';

export const getForeignAllOutfits = async (
	uid: string,
	updateOutfits: (outfit: UserOutfit[]) => void
): Promise<void> => {
	const endpointConfig = {
		method: 'get',
		url: `/api/outfits/u/${uid}?parse=categories`,
	};
	const successFunc = (data: UserOutfit[]): void => {
		// console.log('foreignFits: ', data);
		updateOutfits(data);
	};
	const failureFunc = (): void => {
		updateOutfits([]);
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		failureFunc: failureFunc,
	});
};

export const getAllOutfits = async (
	updateOutfits: (outfit: UserOutfit[]) => void
): Promise<void> => {
	const endpointConfig = {
		method: 'get',
		url: '/api/private/outfits?parse=categories',
	};
	const successFunc = (data: UserOutfit[]): void => {
		updateOutfits(data);
	};
	const failureFunc = (): void => {
		updateOutfits([]);
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		failureFunc: failureFunc,
	});
};

export const getForeignAllClothingItems = async (
	uid: string,
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void
): Promise<void> => {
	const endpointConfig = {
		method: 'get',
		url: `/api/clothing_items/u/${uid}?parse=categories`,
	};
	const successFunc = (data: outfitClothingItemsType): void => {
		setAllOuterwear(data.outerwear);
		setAllTops(data.tops);
		setAllBottoms(data.bottoms);
		setAllShoes(data.shoes);
	};
	const failureFunc = (): void => {
		setAllOuterwear([]);
		setAllTops([]);
		setAllBottoms([]);
		setAllShoes([]);
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		failureFunc: failureFunc,
	});
};

export const getAllClothingItems = async (
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void
): Promise<void> => {
	const endpointConfig = {
		method: 'get',
		url: '/api/private/clothing_items?parse=categories',
	};
	const successFunc = (data: outfitClothingItemsType): void => {
		setAllOuterwear(data.outerwear);
		setAllTops(data.tops);
		setAllBottoms(data.bottoms);
		setAllShoes(data.shoes);
	};
	const failureFunc = (): void => {
		setAllOuterwear([]);
		setAllTops([]);
		setAllBottoms([]);
		setAllShoes([]);
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		failureFunc: failureFunc,
	});
};
