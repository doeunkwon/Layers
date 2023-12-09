import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserClothing } from '../pages/Match';
import { UserOutfit } from '../pages/OutfitView';

import { markedUser, User } from '../pages/Main';

export type StackNavigatorType = {
	userID?: string;
	markedUser?: markedUser;
	item?: UserClothing | UserOutfit;
	editable?: boolean;
	matchItems?: {
		outerwear?: UserClothing;
		tops?: UserClothing;
		bottoms?: UserClothing;
		shoes?: UserClothing;
	};
	setMatchName?: (text: string) => void;
	setImage?: (base64: string) => void;
	setMarked?: () => void;
};

export type StackTypes = {
	Login: StackNavigatorType;
	SignUp: StackNavigatorType;
	Main: StackNavigatorType;
	Profile: StackNavigatorType;
	Preview: StackNavigatorType;
	Match: StackNavigatorType;
	ItemView: StackNavigatorType;
	EditClothing: StackNavigatorType;
	OutfitView: StackNavigatorType;
	Feedback: StackNavigatorType;
	Find: StackNavigatorType;
	Camera: StackNavigatorType;
	Settings: StackNavigatorType;
	MarkedList: StackNavigatorType;
	OutfitPreview: StackNavigatorType;
	ForeignProfile: StackNavigatorType;
};

export const Stack = createNativeStackNavigator<StackTypes>();
