import { dummyId, emptyClothing } from 'constants/Clothing';
import { StackNavigation } from '../../constants/Enums';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from 'utils/StackNavigation';

let createCount = 0;

export const CameraFunc = (
	photo: string,
	navigation: StackNavigationProp<StackTypes>,
	mode: number
): void => {
	if (mode === 1) {
		createCount += 1;
		const newId = dummyId + createCount.toString();
		const clothingItem = {
			...emptyClothing,
			image_url: photo,
			ciid: newId,
		};
		navigation.navigate(StackNavigation.ItemCreate, {
			item: clothingItem,
		});
	}
};
