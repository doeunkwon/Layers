import { StyleSheet } from 'react-native';
import React, { useRef, useContext } from 'react';

import OutfitView from './OutfitView';
import OutfitEdit from './OutfitEdit';

import { Stack } from '../../utils/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';

import { StackNavigation, StepOverTypes } from '../../constants/Enums';
import GlobalStyles from '../../constants/GlobalStyles';

import { headerButton } from '../../components/Modal/HeaderButton';
import { UserClothing, UserClothingList } from '../../pages/Match';

import { baseUrl } from '../../utils/apiUtils';
import axios from 'axios';
import { axiosEndpointErrorHandler } from '../../utils/ErrorHandlers';

import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from 'utils/StackNavigation';
import { MainPageContext } from '../../pages/Main/MainPage';

import Toast from 'react-native-toast-message';
import { toast } from '../../constants/GlobalStrings'

const OutfitViewPage = ({ route }: any) => {
	const { setShouldRefreshOutfitViewPage } = useContext(MainPageContext);

	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const { item, editable } = route.params;

	const outfitTitleRef = useRef(item.title);

	const getFlatArrayOfValues = (
		clothingList: UserClothingList
	): UserClothing[] => {
		return Object.values(clothingList).flat();
	};

	const redirectToProfile = () => {
		navigation.navigate(StackNavigation.Profile, {});
	};

	const OutfitViewComponent = () => (
		<OutfitView clothingItems={getFlatArrayOfValues(item.clothing_items)} />
	);
	const OutfitEditComponent = () => (
		<OutfitEdit
			id={item.oid}
			title={item.title}
			clothingItems={getFlatArrayOfValues(item.clothing_items)}
			titleRef={outfitTitleRef}
			navigateToProfile={redirectToProfile}
		/>
	);

	// Only updates title
	const updateOutfit = async () => {
		const updatedTitle = outfitTitleRef.current;

		try {
			const response = await axios.put(
				`${baseUrl}/api/private/outfits/${item.oid}`,
				{
					title: updatedTitle,
				}
			);

			if (response.status === 200) {
				//alert(`You have updated: ${JSON.stringify(response.data)}`);
				setShouldRefreshOutfitViewPage(true);
				showSuccessUpdateToast()
			} else {
				throw new Error('An error has occurred while updating outfit');
			}
		} catch (error) {
			void axiosEndpointErrorHandler(error);
		}
	};

	const handleSubmitOutfit = () => {
		void updateOutfit();
		redirectToProfile();
	};

	const showSuccessUpdateToast = () => {
		Toast.show({
			type: 'success',
			text1: toast.success,
			text2: toast.yourOutfitHasBeenUpdated,
			topOffset: GlobalStyles.layout.toastTopOffset,
		});
	}

	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator>
				<Stack.Group
					screenOptions={{
						headerTitleStyle: GlobalStyles.typography.subtitle,
						headerStyle: {
							backgroundColor: GlobalStyles.colorPalette.background,
						},
						headerShadowVisible: false,
					}}
				>
					<Stack.Screen
						name={StackNavigation.ItemView}
						component={OutfitViewComponent}
						options={({ navigation }) => ({
							headerTitle: item.title,
							headerRight: editable
								? () =>
									headerButton({
										type: StepOverTypes.edit,
										handlePress: () => {
											navigation.navigate(StackNavigation.EditClothing);
										},
									})
								: undefined,
						})}
					/>
					<Stack.Screen
						name={StackNavigation.EditClothing}
						component={OutfitEditComponent}
						options={{
							headerTitle: 'Edit',
							headerRight: () =>
								headerButton({
									type: StepOverTypes.done,
									handlePress: handleSubmitOutfit,
								}),
						}}
					/>
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default OutfitViewPage;

const styles = StyleSheet.create({});

