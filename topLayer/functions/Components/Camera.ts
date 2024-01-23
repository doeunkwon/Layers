import { dummyId, emptyClothing } from 'constants/Clothing';
import { StackNavigation } from '../../constants/Enums';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from 'utils/StackNavigation';

let createCount = 0;

export const CameraFunc = (
	photo: string,
	navigation: StackNavigationProp<StackTypes>,
	mode: number
): void => {
	if (mode === 1) {
		navigation.goBack();
		createCount += 1;
		const newId = dummyId + createCount.toString();
		const clothingItem = {
			...emptyClothing,
			image_url: photo,
			ciid: newId,
		};
		setTimeout(() => {
			navigation.navigate(StackNavigation.ItemCreate, {
				item: clothingItem,
			});
		}, 100);
	}
};
