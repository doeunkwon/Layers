import { capitalizeFirstLetter } from '../utils/misc';
import { type UserClothing } from '../types/Clothing';
import { ClothingTypes } from './Enums';

export const emptyClothing: UserClothing = {
	ciid: '',
	image_url: '',
	category: '',
	title: '',
	uid: '',
	brands: [],
	size: '',
	color: [],
	created_at: '',
};

export const emptyOutfitClothingItems = {
	outerwear: [],
	tops: [],
	bottoms: [],
	shoes: [],
};

export const clothingItemTypes = [
	{
		label: capitalizeFirstLetter(ClothingTypes.outerwear),
		value: ClothingTypes.outerwear,
	},
	{
		label: capitalizeFirstLetter(ClothingTypes.tops),
		value: ClothingTypes.tops,
	},
	{
		label: capitalizeFirstLetter(ClothingTypes.bottoms),
		value: ClothingTypes.bottoms,
	},
	{
		label: capitalizeFirstLetter(ClothingTypes.shoes),
		value: ClothingTypes.shoes,
	},
];

export const dummyId = 'createID: ';
