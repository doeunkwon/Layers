import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native';

import Header from '../../components/Header/Header';
import Selector from './Selector';
import Button from '../../components/Button/Button';

import { ClothingTypes, StackNavigation } from '../../constants/Enums';
// import { mockItemsData } from '../../constants/testData';

import { MainPageContext } from '../../pages/Main/MainPage';

import {
	type UserClothing,
	type UserClothingList,
	type UserClothingListSingle,
	type UserSelectedClothingList,
} from '.';
import { match } from '../../constants/GlobalStrings';
import GlobalStyles from '../../constants/GlobalStyles';

import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';

const Match: React.FC = () => {
	const { allItems } = useContext(MainPageContext);

	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const [selectedIndexes, setSelectedIndexes] =
		useState<UserSelectedClothingList>({} as UserSelectedClothingList);

	const [data, setData] = useState<UserClothingList>({
		outerwear: [] as UserClothing[],
		tops: [] as UserClothing[],
		bottoms: [] as UserClothing[],
		shoes: [] as UserClothing[],
	});
	const [previewData, setPreviewData] = useState<UserClothingListSingle>({
		outerwear: {} as UserClothing,
		tops: {} as UserClothing,
		bottoms: {} as UserClothing,
		shoes: {} as UserClothing,
	});

	useEffect(() => {
		const filterClothing = (type: string) => {
			return allItems
				.slice(1)
				.filter((value) => value.category.toString() === type);
		};

		setData(
			(value) =>
				({
					...value,
					outerwear: filterClothing(ClothingTypes.outerwear)[0].data,
				} as UserClothingList)
		);

		setData(
			(value) =>
				({
					...value,
					tops: filterClothing(ClothingTypes.tops)[0].data,
				} as UserClothingList)
		);

		setData(
			(value) =>
				({
					...value,
					bottoms: filterClothing(ClothingTypes.bottoms)[0].data,
				} as UserClothingList)
		);

		setData(
			(value) =>
				({
					...value,
					shoes: filterClothing(ClothingTypes.shoes)[0].data,
				} as UserClothingList)
		);
	}, [allItems]);

	useEffect(() => {
		setPreviewData((value) => ({
			...value,
			outerwear: data.outerwear[selectedIndexes.outerwear],
		}));
		setPreviewData((value) => ({
			...value,
			tops: data.tops[selectedIndexes.tops],
		}));
		setPreviewData((value) => ({
			...value,
			bottoms: data.bottoms[selectedIndexes.bottoms],
		}));
		setPreviewData((value) => ({
			...value,
			shoes: data.shoes[selectedIndexes.shoes],
		}));
	}, [selectedIndexes]);

	const selectedIndex = (category: string, index: any) => {
		// !!! Change to select ID
		if (category === ClothingTypes.outerwear)
			setSelectedIndexes((data) => ({ ...data, outerwear: index }));
		if (category === ClothingTypes.tops)
			setSelectedIndexes((data) => ({ ...data, tops: index }));
		if (category === ClothingTypes.bottoms)
			setSelectedIndexes((data) => ({ ...data, bottoms: index }));
		if (category === ClothingTypes.shoes)
			setSelectedIndexes((data) => ({ ...data, shoes: index }));
	};

	const handlePress = () => {
		navigation.navigate(StackNavigation.OutfitPreview, {
			matchItems: {
				outerwear: previewData.outerwear,
				tops: previewData.tops,
				bottoms: previewData.bottoms,
				shoes: previewData.shoes,
			},
		});
	};

	return (
		<>
			<SafeAreaView style={{ gap: 15 }}>
				<Header text={StackNavigation.Match} rightButton={true} />
				<Selector
					outerwear={data.outerwear}
					tops={data.tops}
					bottoms={data.bottoms}
					shoes={data.shoes}
					selectedIndex={selectedIndex}
				/>
			</SafeAreaView>
			<Button
				text={match.preview}
				onPress={handlePress}
				style={{
					position: 'absolute',
					bottom: GlobalStyles.layout.gap * 2.5,
					alignSelf: 'center',
				}}
				bgColor={GlobalStyles.colorPalette.primary[500]}
			/>
		</>
	);
};

export default Match;
