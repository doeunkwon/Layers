import ItemView from './ItemView';
import ItemEdit from './ItemEdit';
import { Stack, type StackTypes } from '../../utils/StackNavigation';
import {
	type RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import { StackNavigation } from '../../constants/Enums';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { type ReactElement } from 'react';
import { type RouteTypes } from '../../types/Routes';

const ItemPage = (): ReactElement => {
	const route = useRoute<RouteProp<RouteTypes, 'ItemPage'>>();
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	const { item } = route.params;

	const redirectToProfile = (): void => {
		navigation.navigate(StackNavigation.Profile, {});
	};
	const directToItemEdit = (): void => {
		navigation.navigate(StackNavigation.ItemEdit, {});
	};

	const ItemViewComponent: React.FC = () => (
		<ItemView clothingItem={item} directToItemEdit={directToItemEdit} />
	);
	const ItemEditComponent: React.FC = () => (
		<ItemEdit clothingItem={item} navigateToProfile={redirectToProfile} />
	);

	return (
		<Stack.Navigator>
			<Stack.Group>
				<Stack.Screen
					name={StackNavigation.ItemView}
					component={ItemViewComponent}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name={StackNavigation.ItemEdit}
					component={ItemEditComponent}
					options={{
						headerShown: false,
					}}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default ItemPage;
