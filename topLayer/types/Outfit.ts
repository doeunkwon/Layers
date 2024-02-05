import { isUserClothingArray, type UserClothing } from './Clothing';

export interface outfitType {
	outerwear: UserClothing;
	tops: UserClothing;
	bottoms: UserClothing;
	shoes: UserClothing;
}

export interface outfitClothingItemsType {
	outerwear: UserClothing[];
	tops: UserClothing[];
	bottoms: UserClothing[];
	shoes: UserClothing[];
	[key: string]: UserClothing[];
}

export enum itemCategories {
	Outerwear = 'outerwear',
	Tops = 'tops',
	Bottoms = 'bottoms',
	Shoes = 'shoes',
}

export interface UserOutfit {
	oid: string;
	title: string;
	clothing_items: outfitClothingItemsType;
	uid: string;
	created_at: string;
}

export interface createdOutfitProps {
	title: string;
	clothing_items: string[];
}

function isOutfitClothingItemsType(
	clothingItems: any
): clothingItems is outfitClothingItemsType {
	return (
		clothingItems &&
		isUserClothingArray(clothingItems.outerwear) &&
		isUserClothingArray(clothingItems.tops) &&
		isUserClothingArray(clothingItems.bottoms) &&
		isUserClothingArray(clothingItems.shoes)
	);
}

export const isUserOutfit = (obj: any): obj is UserOutfit =>
	typeof obj === 'object' &&
	obj !== null &&
	obj !== undefined &&
	typeof obj?.oid === 'string' &&
	typeof obj?.title === 'string' &&
	typeof obj?.uid === 'string' &&
	typeof obj?.created_at === 'string' &&
	isOutfitClothingItemsType(obj.clothing_items);

export const isUserOutfitArray = (obj: any): obj is UserOutfit[] =>
	Array.isArray(obj) && obj.every(isUserOutfit);
