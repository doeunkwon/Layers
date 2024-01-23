import { baseUrl } from '../utils/apiUtils';
import axios from 'axios';
import { axiosEndpointErrorHandlerNoAlert } from '../utils/ErrorHandlers';
import { type outfitClothingItemsType, type UserOutfit } from '../types/Outfit';
import { type UserClothing } from '../types/Clothing';
import { type Dispatch, type SetStateAction } from 'react';

export const getForeignAllOutfits = async (
	uid: string,
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	void getAllOutfitsHandler(
		updateOutfits,
		setIsLoading,
		`${baseUrl}/api/outfits/u/${uid}?parse=categories`
	);
};

export const getAllOutfits = async (
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	void getAllOutfitsHandler(
		updateOutfits,
		setIsLoading,
		`${baseUrl}/api/private/outfits?parse=categories`
	);
};

const getAllOutfitsHandler = async (
	updateOutfits: (outfit: UserOutfit[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>,
	query: string
): Promise<void> => {
	try {
		const { data, status } = await axios.get<{ data: UserOutfit[] }>(query);

		if (status === 200) {
			updateOutfits(data.data);
			setIsLoading((n) => n - 1);
		} else {
			throw new Error(`An Get All Outfits Error Has Occurred: ${status}`);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		updateOutfits([]);
		setIsLoading((n) => n - 1);
	}
};

export const getForeignAllClothingItems = async (
	uid: string,
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	void getAllClothingItemsHandler(
		setAllOuterwear,
		setAllTops,
		setAllBottoms,
		setAllShoes,
		setIsLoading,
		`${baseUrl}/api/clothing_items/u/${uid}?parse=categories`
	);
};

export const getAllClothingItems = async (
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>
): Promise<void> => {
	void getAllClothingItemsHandler(
		setAllOuterwear,
		setAllTops,
		setAllBottoms,
		setAllShoes,
		setIsLoading,
		`${baseUrl}/api/private/clothing_items?parse=categories`
	);
};

const getAllClothingItemsHandler = async (
	setAllOuterwear: (wear: UserClothing[]) => void,
	setAllTops: (wear: UserClothing[]) => void,
	setAllBottoms: (wear: UserClothing[]) => void,
	setAllShoes: (wear: UserClothing[]) => void,
	setIsLoading: Dispatch<SetStateAction<number>>,
	query: string
): Promise<void> => {
	try {
		const { data, status } = await axios.get<{ data: outfitClothingItemsType }>(
			query
		);

		if (status === 200) {
			setAllOuterwear(data.data.outerwear);
			setAllTops(data.data.tops);
			setAllBottoms(data.data.bottoms);
			setAllShoes(data.data.shoes);
			setIsLoading((n) => n - 1);
		} else {
			throw new Error(
				`An Get All Clothing Items Error Has Occurred: ${status}`
			);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		setAllOuterwear([]);
		setAllTops([]);
		setAllBottoms([]);
		setAllShoes([]);
		setIsLoading((n) => n - 1);
	}
};
