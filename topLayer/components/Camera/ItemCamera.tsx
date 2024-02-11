import React, { type ReactElement } from 'react';
import CameraComponent from './Camera';
import ItemCreate from '../../pages/ItemView/ItemCreate';
import { Stack } from '../../utils/StackNavigation';
import { StackNavigation } from '../../constants/Enums';

const ItemCamera = (): ReactElement => {
	const ItemCreateComponent: React.FC = () => <ItemCreate />;
	const CameraComponents: React.FC = () => <CameraComponent mode={1} />;

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: 'black', opacity: 1 },
			}}
		>
			<Stack.Screen
				name={StackNavigation.CameraComponents}
				component={CameraComponents}
			/>
			<Stack.Screen
				name={StackNavigation.ItemCreate}
				component={ItemCreateComponent}
			/>
		</Stack.Navigator>
	);
};

export default ItemCamera;
