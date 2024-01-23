import { type outfitClothingItemsType, type UserOutfit } from '../types/Outfit';
import { type UserClothing } from '../types/Clothing';
import { type Dispatch, type SetStateAction } from 'react';
import { endpoint } from './General/endpoint';

export const getForeignAllOutfits = async (
	uid: string,
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	const endpointConfig = {
		method: 'get',
		url: `/api/outfits/u/${uid}?parse=categories`,
	};
	const successFunc = (data: UserOutfit[]): void => {
		updateOutfits(data);
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		updateOutfits([]);
		setIsLoading((n) => n - 1);
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		failureFunc: failureFunc,
	});
};

export const getAllOutfits = async (
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	const endpointConfig = {
		method: 'get',
		url: '/api/private/outfits?parse=categories',
	};
	const successFunc = (data: UserOutfit[]): void => {
		updateOutfits(data);
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		updateOutfits([]);
		setIsLoading((n) => n - 1);
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
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
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

		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		setAllOuterwear([]);
		setAllTops([]);
		setAllBottoms([]);
		setAllShoes([]);

		setIsLoading((n) => n - 1);
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
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
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
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		setAllOuterwear([]);
		setAllTops([]);
		setAllBottoms([]);
		setAllShoes([]);
		setIsLoading((n) => n - 1);
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		failureFunc: failureFunc,
	});
};
