import {
	createNativeStackNavigator,
	type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { type UserClothing } from '../types/Clothing';
import { type outfitType, type UserOutfit } from '../types/Outfit';
import { type markedUser } from '../types/User';
import { createStackNavigator } from '@react-navigation/stack';

// DO NOT ADD ANY FUNCTIONS UNDER StackNavigatorType
export interface StackNavigatorType {
	userID?: string;
	markedUser?: markedUser;
	item?: UserClothing | UserOutfit;
	editable?: boolean;
	matchItems?: outfitType;
	returnTo?: NativeStackNavigationProp<StackTypes>;
	returnToPfp?: boolean;
}

export interface StackTypes {
	[key: string]: StackNavigatorType;
	Login: StackNavigatorType;
	SignUp: StackNavigatorType;
	Main: StackNavigatorType;
	Profile: StackNavigatorType;
	Preview: StackNavigatorType;
	Match: StackNavigatorType;
	ItemView: StackNavigatorType;
	ItemCreate: StackNavigatorType;
	ItemEdit: StackNavigatorType;
	OutfitView: StackNavigatorType;
	OutfitEdit: StackNavigatorType;
	Feedback: StackNavigatorType;
	Find: StackNavigatorType;
	ItemCamera: StackNavigatorType;
	CameraPfp: StackNavigatorType;
	CameraComponents: StackNavigatorType;
	Settings: StackNavigatorType;
	MarkedList: StackNavigatorType;
	OutfitPreview: StackNavigatorType;
	ForeignProfile: StackNavigatorType;
}

export const Stack = createNativeStackNavigator<StackTypes>();
