import React, { useState } from 'react';
import { StackNavigation } from '../../constants/Enums';
import Profile from './Profile';
import SettingsPage from './SettingsPage';
import { NavigationContainer } from '@react-navigation/native';
import CameraPfp from '../../components/Camera/CameraPfp';
import OutfitPage from '../OutfitView/OutfitPage';
import ItemPage from '../../pages/ItemView/ItemPage';
import { TransitionPresets } from '@react-navigation/stack';
import { Stack } from '../../utils/StackNavigation';
import { emptyClothing } from '../../constants/Clothing';
import ItemCreate from '../../pages/ItemView/ItemCreate';
import CameraComponent from '../../components/Camera/Camera';

const dummyId = 'createID: ';
let createCount = 0;

const ProfilePage: React.FC = () => {
	const [clothingItem, setClothingItem] = useState({ ...emptyClothing });

	const cameraFunction = (image: string): void => {
		createCount += 1;
		const newId = dummyId + createCount.toString();
		setClothingItem({
			...clothingItem,
			image_url: image,
			ciid: newId,
		});
	};
	const ItemCreateComponent: React.FC = () => (
		<ItemCreate clothingItem={clothingItem} />
	);

	const CameraComponents: React.FC = () => (
		<CameraComponent cameraFunction={cameraFunction} navigate={true} />
	);

	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name={StackNavigation.Profile} component={Profile} />
				<Stack.Group
					screenOptions={{
						presentation: 'modal',
					}}
				>
					<Stack.Screen
						name={StackNavigation.Settings}
						component={SettingsPage}
					/>
					<Stack.Screen name={StackNavigation.ItemPage} component={ItemPage} />
					<Stack.Screen
						name={StackNavigation.OutfitPage}
						component={OutfitPage}
					/>
					<Stack.Screen
						name={StackNavigation.ItemCreate}
						component={ItemCreateComponent}
					/>
					<Stack.Group
						screenOptions={{
							...TransitionPresets.ModalSlideFromBottomIOS,
							presentation: 'transparentModal',
						}}
					>
						<Stack.Screen
							name={StackNavigation.CameraPfp}
							component={CameraPfp}
						/>
						<Stack.Screen
							name={StackNavigation.CameraComponents}
							component={CameraComponents}
						/>
					</Stack.Group>
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ProfilePage;
