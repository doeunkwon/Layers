import { RouteProp, ParamListBase } from '@react-navigation/native';
import {
	NativeStackNavigationEventMap,
	NativeStackNavigationOptions,
	createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { UserClothing } from '../pages/Match';
import { UserOutfit } from '../pages/OutfitEdit';
import { ReactNode } from 'react';

export type StackNavigatorType = {
	item?: UserClothing | UserOutfit;
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
