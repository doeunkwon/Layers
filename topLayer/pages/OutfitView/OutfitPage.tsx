import { StyleSheet } from 'react-native';
import React, { type ReactElement } from 'react';
import OutfitView from './OutfitView';
import OutfitEdit from './OutfitEdit';
import { Stack } from '../../utils/StackNavigation';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../constants/Enums';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { type RouteTypes } from '../../types/Routes';
import { getFlatArrayOfValues } from '../../functions/Outfit/Outfit';

const OutfitPage = (): ReactElement => {
	const route = useRoute<RouteProp<RouteTypes, 'OutfitPage'>>();
	const navigation = useNavigation<StackNavigationProp<StackTypes>>();
	const { item } = route.params;
	const { oid, clothing_items, title } = item;
	const clothingItems = getFlatArrayOfValues(clothing_items);

	const redirectToProfile = (): void => {
		navigation.navigate(StackNavigation.Profile, {});
	};

	const directToEdit = (): void => {
		navigation.navigate(StackNavigation.OutfitEdit, {});
	};

	const OutfitViewComponent = (): ReactElement => (
		<OutfitView
			title={title}
			clothingItems={clothingItems}
			directToOutfitEdit={directToEdit}
		/>
	);
	const OutfitEditComponent = (): ReactElement => (
		<OutfitEdit
			id={oid}
			title={title}
			clothingItems={clothingItems}
			navigateToProfile={redirectToProfile}
		/>
	);

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Group>
				<Stack.Screen
					name={StackNavigation.OutfitView}
					component={OutfitViewComponent}
				/>
				<Stack.Screen
					name={StackNavigation.OutfitEdit}
					component={OutfitEditComponent}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default OutfitPage;

const styles = StyleSheet.create({});
