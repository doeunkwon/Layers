import React, { type ReactElement } from 'react';
import { Stack, type StackTypes } from '../../utils/StackNavigation';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../constants/Enums';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePhotoUpdate } from '../../Contexts/CameraContext';
import CameraComponent from './Camera';

const CameraPfp = (): ReactElement => {
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	const setPfpUrl = usePhotoUpdate();

	const updateProfilePicture = (image: string): void => {
		navigation.goBack();
		setPfpUrl({
			type: 'new photo',
			image: image,
		});
	};

	const CameraComponents: React.FC = () => (
		<CameraComponent cameraFunction={updateProfilePicture} />
	);

	return (
		<Stack.Navigator>
			<Stack.Screen
				name={StackNavigation.CameraComponents}
				component={CameraComponents}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default CameraPfp;
