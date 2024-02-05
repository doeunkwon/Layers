import React, { type ReactElement } from 'react';
import { StackNavigation } from '../../constants/Enums';
import Profile from './Profile';
import SettingsPage from './SettingsPage';
import { NavigationContainer } from '@react-navigation/native';
import CameraPfp from '../../components/Camera/CameraPfp';
import OutfitPage from '../OutfitView/OutfitPage';
import ItemPage from '../../pages/ItemView/ItemPage';
import { Stack } from '../../utils/StackNavigation';
import ItemCreate from '../../pages/ItemView/ItemCreate';
import CameraComponent from '../../components/Camera/Camera';

const ProfilePage = (): ReactElement => {
	const CameraComponents: React.FC = () => <CameraComponent mode={1} />;

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

					<Stack.Group
						screenOptions={{
							presentation: 'fullScreenModal',
							animation: 'slide_from_bottom',
							gestureEnabled: true,
							gestureDirection: 'vertical',
						}}
					>
						<Stack.Screen
							name={StackNavigation.ItemCreate}
							component={ItemCreate}
						/>

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
