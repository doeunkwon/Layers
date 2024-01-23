import React, { type ReactElement, useState } from 'react';
import CameraComponent from './Camera';
import ItemCreate from '../../pages/ItemView/ItemCreate';
import { Stack, type StackTypes } from '../../utils/StackNavigation';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../constants/Enums';
import { type StackNavigationProp } from '@react-navigation/stack';
import { emptyClothing } from '../../constants/Clothing';

const dummyId = 'createID: ';
let createCount = 0;

const ItemCamera = (): ReactElement => {
	const navigation = useNavigation<StackNavigationProp<StackTypes>>();

	const [clothingItem, setClothingItem] = useState({ ...emptyClothing });

	const cameraFunction = (image: string): void => {
		createCount += 1;
		const newId = dummyId + createCount.toString();
		setClothingItem({
			...clothingItem,
			image_url: image,
			ciid: newId,
		});
		navigation.navigate(StackNavigation.ItemCreate, {});
	};
	const ItemCreateComponent: React.FC = () => (
		<ItemCreate clothingItem={clothingItem} />
	);

	const CameraComponents: React.FC = () => (
		<CameraComponent cameraFunction={cameraFunction} />
	);

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Group>
				<Stack.Screen
					name={StackNavigation.CameraComponents}
					component={CameraComponents}
					options={{
						cardStyle: { backgroundColor: 'black', opacity: 1 },
					}}
				/>
				<Stack.Screen
					name={StackNavigation.ItemCreate}
					component={ItemCreateComponent}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default ItemCamera;
