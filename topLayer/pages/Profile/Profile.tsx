import React, { useRef, useState, useContext, type ReactElement } from 'react';
import { StyleSheet, type FlatList, type ViewToken } from 'react-native';
import Navbar from '../../components/Bar/Navbar';
import {
	IndexToCategory,
	StackNavigation,
	ClothingTypes,
} from '../../constants/Enums';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { type UserClothing } from '../../types/Clothing';
import { type UserOutfit } from '../../types/Outfit';
import { MainPageContext } from '../../pages/Main/MainPage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../Contexts/UserContext';
import ProfileHeading from '../../components/Profile/ProfileHeading';
import CategoryComponent from '../../components/Category/Category';
import {
	handleCategoryChange,
	handleItemChange,
} from '../../functions/Profile/Profile';
import { type UserAllItems } from '../../types/AllItems';
import { Loading } from '../../components/Loading/Loading';

const Profile = (): ReactElement => {
	const data = useUser();
	const { allItems, isLoading } = useContext(MainPageContext);
	console.log('Loading? ', isLoading);

	const navigation = useNavigation<StackNavigationProp<StackTypes>>();
	const flatListRef = useRef<FlatList<UserAllItems>>(null);
	const [selectedCategory, setSelectedCategory] = useState(
		ClothingTypes.outfits as string
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

	const toggleSettingsModal = (): void => {
		navigation.navigate(StackNavigation.Settings, {});
	};

	return (
		<SafeAreaView style={styles.container}>
			<Navbar />
			<ProfileHeading user={data} profilePicturePress={toggleSettingsModal} />
			{isLoading > 0 ? (
				<Loading />
			) : (
				<CategoryComponent
					allItems={allItems}
					selectedCategory={selectedCategory}
					flatListRef={flatListRef}
					handleCategoryChange={(category: string) => {
						handleCategoryChange(category, flatListRef, setSelectedCategory);
					}}
					handleItemChange={(item: UserClothing | UserOutfit) => {
						handleItemChange(item, navigation);
					}}
					handleViewableItemsChanged={handleViewableItemsChanged}
				/>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Profile;
