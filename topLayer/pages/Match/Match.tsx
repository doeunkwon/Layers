import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Header from '../../components/Header/Header';
import Selector from './Selector';
import Button from '../../components/Button/Button';
import { ClothingTypes, StackNavigation } from '../../constants/Enums';
import { MainPageContext } from '../../pages/Main/MainPage';

import {
	isUserClothingArray,
	type UserClothing,
	type UserSelectedClothingList,
} from '../../types/Clothing';
import { match } from '../../constants/GlobalStrings';
import GlobalStyles from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { type UserAllItems } from '../../types/AllItems';

import Icon from 'react-native-remix-icon';
import { screenHeight } from '../../utils/modalMaxShow';
import {
	type outfitType,
	type outfitClothingItemsType,
} from '../../types/Outfit';
import { emptyClothing } from '../../constants/Clothing';

const Match: React.FC = () => {
	const { allItems } = useContext(MainPageContext);

	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	const [selectedIndexes, setSelectedIndexes] =
		useState<UserSelectedClothingList>({
			outerwear: 0,
			tops: 0,
			bottoms: 0,
			shoes: 0,
		});
	const [data, setData] = useState<outfitClothingItemsType>({
		outerwear: [] as UserClothing[],
		tops: [] as UserClothing[],
		bottoms: [] as UserClothing[],
		shoes: [] as UserClothing[],
	});
	const [previewData, setPreviewData] = useState<outfitType>({
		outerwear: { ...emptyClothing },
		tops: { ...emptyClothing },
		bottoms: { ...emptyClothing },
		shoes: { ...emptyClothing },
	});

	useEffect(() => {
		const filterClothing = (type: string): UserAllItems[] => {
			return allItems
				.slice(1)
				.filter((value) => value.category.toString() === type);
		};

		const newData: outfitClothingItemsType = {
			outerwear: [],
			tops: [],
			bottoms: [],
			shoes: [],
		};
		const outerwear = filterClothing(ClothingTypes.outerwear)[0].data;
		const tops = filterClothing(ClothingTypes.tops)[0].data;
		const bottoms = filterClothing(ClothingTypes.bottoms)[0].data;
		const shoes = filterClothing(ClothingTypes.shoes)[0].data;
		if (isUserClothingArray(outerwear)) {
			newData.outerwear = outerwear;
		}
		if (isUserClothingArray(tops)) {
			newData.tops = tops;
		}
		if (isUserClothingArray(bottoms)) {
			newData.bottoms = bottoms;
		}
		if (isUserClothingArray(shoes)) {
			newData.shoes = shoes;
		}

		setData(() => newData);
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

	const selectedIndex = (category: string, index: number): void => {
		// !!! Change to select ID
		if (category === ClothingTypes.outerwear) {
			setSelectedIndexes((data) => ({ ...data, outerwear: index }));
		}
		if (category === ClothingTypes.tops) {
			setSelectedIndexes((data) => ({ ...data, tops: index }));
		}
		if (category === ClothingTypes.bottoms) {
			setSelectedIndexes((data) => ({ ...data, bottoms: index }));
		}
		if (category === ClothingTypes.shoes) {
			setSelectedIndexes((data) => ({ ...data, shoes: index }));
		}
	};

	const handlePress = (): void => {
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
				<Header
					text={StackNavigation.Match}
					rightButton={true}
					rightButtonNavigateTo={0}
				/>
				{data.outerwear.length !== 0 ||
				data.tops.length !== 0 ||
				data.bottoms.length !== 0 ||
				data.shoes.length !== 0 ? (
					<Selector
						outerwear={data.outerwear}
						tops={data.tops}
						bottoms={data.bottoms}
						shoes={data.shoes}
						selectedIndex={selectedIndex}
					/>
				) : (
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							height: screenHeight * 0.73,
							gap: 5,
						}}
					>
						<Icon
							name={GlobalStyles.icons.shirtOutline}
							color={GlobalStyles.colorPalette.primary[300]}
							size={GlobalStyles.sizing.icon.large}
						/>
						<Text
							style={[
								GlobalStyles.typography.subtitle,
								{ color: GlobalStyles.colorPalette.primary[300] },
							]}
						>
							No clothing
						</Text>
					</View>
				)}
			</SafeAreaView>
			<Button
				text={match.preview}
				onPress={handlePress}
				style={{
					position: 'absolute',
					bottom: GlobalStyles.layout.gap * 3,
					alignSelf: 'center',
				}}
				bgColor={GlobalStyles.colorPalette.primary[500]}
				disabled={
					data.outerwear.length === 0 &&
					data.tops.length === 0 &&
					data.bottoms.length === 0 &&
					data.shoes.length === 0
				}
			/>
		</>
	);
};

export default Match;
