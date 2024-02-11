import { type TagActionType, type TagCategoryType } from '../components/Tag';

const outfits = 'outfits';
const outerwear = 'outerwear';
const tops = 'tops';
const bottoms = 'bottoms';
const shoes = 'shoes';

export const StepOverTypes = {
	edit: 'Edit',
	done: 'Done',
	send: 'Send',
	next: 'Next',
	update: 'Update',
	logout: 'Logout',
	down: 'Down',
	rightArrow: 'Right Arrow',
	leftArrow: 'Left Arrow',
} as const;

export const ClothingTypes = {
	outfits: outfits,
	outerwear: outerwear,
	tops: tops,
	bottoms: bottoms,
	shoes: shoes,
} as const;

export const StackNavigation = {
	Login: 'Login',
	SignUp: 'SignUp',
	Main: 'Main',
	Profile: 'Profile',
	Preview: 'Preview',
	Match: 'Match',
	Feedback: 'Feedback',
	Find: 'Find',
	ItemPage: 'ItemPage',
	ItemViewPage: 'ItemViewPage',
	ItemView: 'ItemView',
	ItemCreate: 'ItemCreate',
	ItemCamera: 'ItemCamera',
	ItemEdit: 'ItemEdit',
	OutfitPage: 'OutfitPage',
	OutfitViewPage: 'OutfitViewPage',
	OutfitView: 'OutfitView',
	OutfitEdit: 'OutfitEdit',
	CameraPfp: 'CameraPfp',
	CameraComponents: 'CameraComponents',
	Settings: 'Settings',
	MarkedList: 'MarkedList',
	OutfitPreview: 'Preview',
	ForeignProfile: 'ForeignProfile',
} as const;

export const NavigationBack = {
	back: 'back',
	close: 'close',
};

export const TagAction: TagActionType = {
	static: 'static',
	push: 'push',
	add: 'add',
	remove: 'remove',
};

export const TagCategory: TagCategoryType = {
	color: 'Color',
	brand: 'Brand',
};

export const CategoryToIndex: Record<string, number> = {
	outfits: 0,
	outerwear: 1,
	tops: 2,
	bottoms: 3,
	shoes: 4,
};

export const IndexToCategory: Record<number, string> = {
	0: outfits,
	1: outerwear,
	2: tops,
	3: bottoms,
	4: shoes,
};

export const ColorTags: Record<string, string> = {
	'#4891FF': 'Blue',
	'#46B9C9': 'Teal',
	'#A3DEC9': 'Mint',
	'#6DC86E': 'Green',
	'#76956B': 'Olive',
	'#EEE16B': 'Yellow',
	'#E8D3B4': 'Beige',
	'#977854': 'Brown',
	'#EBA655': 'Orange',
	'#E55A5A': 'Red',
	'#AD4E4E': 'Maroon',
	'#F67ECE': 'Pink',
	'#B77AC7': 'Purple',
	'#3869B2': 'Navy',
	'#121212': 'Black',
	'#CDCDCD': 'Grey',
	'#FFFFF7': 'White',
	'#FFFBEB': 'Cream',
};
