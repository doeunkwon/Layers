import { UserAllItems2, type UserAllItems } from '../../types/AllItems';
import { type UserClothing } from '../../types/Clothing';
import { type UserOutfit } from '../../types/Outfit';
import { CategoryToIndex, StackNavigation } from '../../constants/Enums';
import { type Dispatch, type RefObject, type SetStateAction } from 'react';
import { type FlatList } from 'react-native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';

export const handleIndexChange = (
	index: number,
	flatListRef: RefObject<FlatList<UserAllItems>>
): void => {
	if (flatListRef.current != null) {
		flatListRef.current?.scrollToIndex({ index, animated: false });
	}
};

export const handleCategoryChange = (
	category: string,
	flatListRef: RefObject<FlatList<UserAllItems>>,
	setSelectedCategory: Dispatch<SetStateAction<string>>
): void => {
	setSelectedCategory(category);
	handleIndexChange(CategoryToIndex[category], flatListRef);
};

export const handleForeignItemPress = (
	item: UserClothing | UserOutfit,
	navigation: StackNavigationProp<StackTypes>
): void => {
	if ('oid' in item) {
		navigation.navigate(StackNavigation.OutfitViewPage, {
			item: item,
		});
	} else {
		navigation.navigate(StackNavigation.ItemViewPage, {
			item: item,
		});
	}
};

export const handleItemChange = (
	item: UserClothing | UserOutfit,
	navigation: StackNavigationProp<StackTypes>
): void => {
	if ('oid' in item) {
		navigation.navigate(StackNavigation.OutfitPage, {
			item: item,
		});
	} else {
		navigation.navigate(StackNavigation.ItemPage, {
			item: item,
		});
	}
};

export const allUserItems = (
	allOutfits: UserOutfit[],
	allOuterwear: UserClothing[],
	allTops: UserClothing[],
	allBottoms: UserClothing[],
	allShoes: UserClothing[]
): UserAllItems[] => {
	const items = [
		{
			category: 'outfits',
			data: allOutfits,
		},
		{
			category: 'outerwear',
			data: allOuterwear,
		},
		{
			category: 'tops',
			data: allTops,
		},
		{
			category: 'bottoms',
			data: allBottoms,
		},
		{
			category: 'shoes',
			data: allShoes,
		},
	];
	return items;
};

export const allUserItems2 = (
	allOutfits: UserOutfit[],
	allOuterwear: UserClothing[],
	allTops: UserClothing[],
	allBottoms: UserClothing[],
	allShoes: UserClothing[]
): UserAllItems2 => {
	const items = {
		Outfits: allOutfits,
		Outerwear: allOuterwear,
		Tops: allTops,
		Bottoms: allBottoms,
		Shoes: allShoes,
	};
	return items;
};
