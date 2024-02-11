import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type UserClothing } from '../types/Clothing';
import { type outfitType, type UserOutfit } from '../types/Outfit';
import { type markedUser } from '../types/User';
// import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';

// DO NOT ADD ANY FUNCTIONS UNDER StackNavigatorType
export interface StackNavigatorType {
	markedUser?: markedUser;
	item?: UserClothing | UserOutfit;
	matchItems?: outfitType;
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
	CameraPfp: StackNavigatorType;
	CameraComponents: StackNavigatorType;
	Settings: StackNavigatorType;
	MarkedList: StackNavigatorType;
	OutfitPreview: StackNavigatorType;
	ForeignProfile: StackNavigatorType;
}

enableScreens(true);
export const Stack = createNativeStackNavigator<StackTypes>();
