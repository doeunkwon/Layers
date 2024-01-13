import React, { useRef, useState, useEffect, type ReactElement } from 'react';
import {
	View,
	Pressable,
	StyleSheet,
	type FlatList,
	type ViewToken,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import { IndexToCategory, ClothingTypes } from '../../constants/Enums';
import GlobalStyles from '../../constants/GlobalStyles';
import {
	type RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { type UserClothing } from '../../types/Clothing';
import { type UserOutfit } from '../../types/Outfit';
import { type markedUser } from '../../types/User';
import {
	getForeignAllClothingItems,
	getForeignAllOutfits,
} from '../../endpoints/wardrobe';
import { useMarkUserFunc } from '../../Contexts/ForeignUserContext';
import { type UserAllItems } from '../../types/AllItems';
import { type RouteTypes } from 'types/Routes';
import ProfileHeading from '../../components/Profile/ProfileHeading';
import PrivateProfile from '../../components/Profile/Private';
import CategoryComponent from '../../components/Category/Category';
import {
	handleCategoryChange,
	handleItemChange,
} from '../../components/Profile/profileFunctions';

const ForeignProfile = (): ReactElement => {
	const route = useRoute<RouteProp<RouteTypes, 'ForeignProfile'>>();
	const user: markedUser = route.params.markedUser;
	const markUserFunc = useMarkUserFunc();

	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	const flatListRef = useRef<FlatList<UserAllItems>>(null);

	const [allOutfits, setAllOutfits] = useState<UserOutfit[]>([]);
	const [allOuterwear, setAllOuterwear] = useState<UserClothing[]>([]);
	const [allTops, setAllTops] = useState<UserClothing[]>([]);
	const [allBottoms, setAllBottoms] = useState<UserClothing[]>([]);
	const [allShoes, setAllShoes] = useState<UserClothing[]>([]);

	// initializes an array of clothing categories and their data
	const allItems: UserAllItems[] = [
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

	const [selectedCategory, setSelectedCategory] = useState(
		ClothingTypes.outfits as string
	);

	const [iconName, setIconName] = useState(
		user.marked
			? GlobalStyles.icons.bookmarkFill
			: GlobalStyles.icons.bookmarkOutline
	);

	const handleViewableItemsChanged = useRef(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			if (viewableItems.length > 0) {
				const visibleItem = viewableItems[0];
				const index = allItems.findIndex(
					(item) => item.category === visibleItem.item.category
				);
				setSelectedCategory(IndexToCategory[index]);
			}
		}
	).current;

	useEffect(() => {
		void getForeignAllOutfits(user.uid, setAllOutfits);
		void getForeignAllClothingItems(
			user.uid,
			setAllOuterwear,
			setAllTops,
			setAllBottoms,
			setAllShoes
		);
	}, []);

	const handleBookmarkPress = (): void => {
		if (iconName === GlobalStyles.icons.bookmarkFill) {
			markUserFunc(true);
			setIconName(GlobalStyles.icons.bookmarkOutline);
			user.marked = false;
		} else {
			markUserFunc(false);
			setIconName(GlobalStyles.icons.bookmarkFill);
			user.marked = true;
		}
	};

	return (
		<>
			<View style={{ paddingVertical: GlobalStyles.layout.modalTopPadding }} />
			<View style={{ flex: 1 }}>
				<ProfileHeading user={user} />
				{user.private_option ? (
					<PrivateProfile />
				) : (
					<CategoryComponent
						allItems={allItems}
						selectedCategory={selectedCategory}
						flatListRef={flatListRef}
						handleCategoryChange={(category: string) => {
							handleCategoryChange(category, flatListRef, setSelectedCategory);
						}}
						handleItemChange={(item: UserClothing | UserOutfit) => {
							handleItemChange(item, navigation, false);
						}}
						handleViewableItemsChanged={handleViewableItemsChanged}
					/>
				)}

				<View style={styles.bookmarkIconWrapper}>
					<Pressable onPress={handleBookmarkPress}>
						<Icon
							name={iconName}
							color={GlobalStyles.colorPalette.primary[900]}
							size={GlobalStyles.sizing.icon.regular}
						/>
					</Pressable>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	bookmarkIconWrapper: {
		position: 'absolute',
		top: 0,
		right: GlobalStyles.layout.xGap,
	},
});

export default ForeignProfile;
