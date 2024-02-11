import { type outfitClothingItemsType, type UserOutfit } from '../types/Outfit';
import { type UserClothing } from '../types/Clothing';
import { type Dispatch, type SetStateAction } from 'react';
import { EndpointGetForeignAllClothingItems } from './public/clothingItem';
import { EndpointGetAllOutfits } from './private/outfit';
import { EndpointGetAllClothingItems } from './private/clothingItem';
import { EndpointGetForeignAllOutfits } from './public/outfit';

export const getForeignAllOutfits = async (
	uid: string,
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	const successFunc = (data: UserOutfit[]): void => {
		updateOutfits(data);
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		setIsLoading((n) => n - 1);
	};
	void EndpointGetForeignAllOutfits(uid, successFunc, failureFunc);
};

export const getAllOutfits = async (
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	const successFunc = (data: UserOutfit[]): void => {
		updateOutfits(data);
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		setIsLoading((n) => n - 1);
	};
	void EndpointGetAllOutfits(successFunc, failureFunc);
};

export const getForeignAllClothingItems = async (
	uid: string,
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	const successFunc = (data: outfitClothingItemsType): void => {
		setAllOuterwear(data.outerwear);
		setAllTops(data.tops);
		setAllBottoms(data.bottoms);
		setAllShoes(data.shoes);
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		setIsLoading((n) => n - 1);
	};
	void EndpointGetForeignAllClothingItems(uid, successFunc, failureFunc);
};

export const getAllClothingItems = async (
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	const successFunc = (data: outfitClothingItemsType): void => {
		setAllOuterwear(data.outerwear);
		setAllTops(data.tops);
		setAllBottoms(data.bottoms);
		setAllShoes(data.shoes);
		setIsLoading((n) => n - 1);
	};
	const failureFunc = (): void => {
		setIsLoading((n) => n - 1);
	};
	void EndpointGetAllClothingItems(successFunc, failureFunc);
};
