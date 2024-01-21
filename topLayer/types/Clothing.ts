export interface Sizes {
	label: string;
	value: string;
}

export interface editableClothingTypes {
	category: string;
	title: string;
	size: string;
	color: string[];
	// missing: image and brands
}

export interface creationClothingTypes {
	category: string;
	title: string;
	size: string;
	color: string[];
	image: string;
	// missing: brands
}

export interface UserClothing {
	ciid: string;
	image_url: string;
	category: string;
	title: string;
	uid: string;
	brands: string[];
	size: string;
	color: string[];
	created_at: string;
}

export interface UserSelectedClothingList {
	outerwear: number;
	tops: number;
	bottoms: number;
	shoes: number;
}

export interface UserClothingPadding {
	outerwear: Array<UserClothing | Record<string, number>>;
	tops: Array<UserClothing | Record<string, number>>;
	bottoms: Array<UserClothing | Record<string, number>>;
	shoes: Array<UserClothing | Record<string, number>>;
}

export const isUserClothing = (obj: any): obj is UserClothing =>
	obj !== null &&
	obj !== undefined &&
	typeof obj?.ciid === 'string' &&
	typeof obj?.image_url === 'string' &&
	typeof obj?.category === 'string' &&
	typeof obj?.title === 'string' &&
	typeof obj?.uid === 'string' &&
	Array.isArray(obj.brands) &&
	typeof obj?.size === 'string' &&
	Array.isArray(obj.color) &&
	typeof obj?.created_at === 'string';

export const isUserClothingArray = (obj: any): obj is UserClothing[] =>
	Array.isArray(obj) && obj.every(isUserClothing);
