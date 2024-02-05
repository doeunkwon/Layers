import { View, StyleSheet, Alert } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { usePhoto, usePhotoUpdate } from '../../Contexts/CameraContext';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import { StackNavigation, StepOverTypes } from '../../constants/Enums';
import { useForm } from 'react-hook-form';
import { settings, toast } from '../../constants/GlobalStrings';
import { showSuccessToast } from '../../components/Toasts/Toasts';
import { useUpdateUser, useUser } from '../../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import SettingsFields from '../../components/Settings/SettingsFields';
import { Loading } from '../../components/Loading/Loading';
import Button from '../../components/Button/Button';
import { type formUser } from '../../types/User';
import {
	EndpointDeleteUser,
	EndpointUpdateUser,
} from '../../endpoints/private/user';
import { EndpointLogout } from '../../endpoints/authentication';

const SettingsPage: React.FC = () => {
	const data = useUser();
	const refreshUser = useUpdateUser();
	const resetPhoto = usePhotoUpdate();
	const photo = usePhoto();
	const { first_name, last_name, email, username, private_option } = data;
	const profile_picture = useRef(data.profile_picture);

	console.log('settings pp: ', profile_picture);
	const [isLoading, setIsLoading] = useState(false); // Add loading state
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const defaultForm: formUser = {
		first_name: first_name,
		last_name: last_name,
		email: email,
		username: username,
		password: '**********',
		private_option: private_option,
		profile_picture: profile_picture.current,
	};

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: defaultForm,
	});

	useEffect(() => {
		setValue('profile_picture', photo);
	}, [photo]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			if (photo !== profile_picture.current) {
				resetPhoto({
					type: 'new photo',
					image: profile_picture.current,
				});
			}
		});
		return unsubscribe;
	});

	const updateUser = async (formValues: formUser): Promise<void> => {
		const updatedFields: Partial<formUser> = {};

		if (formValues.first_name !== first_name) {
			updatedFields.first_name = formValues.first_name;
		}
		if (formValues.last_name !== last_name) {
			updatedFields.last_name = formValues.last_name;
		}
		if (formValues.email !== email) {
			updatedFields.email = formValues.email;
		}
		if (formValues.username !== username) {
			updatedFields.username = formValues.username;
		}
		if (formValues.password !== '**********') {
			updatedFields.password = formValues.password;
		}
		if (formValues.private_option !== private_option) {
			updatedFields.private_option = formValues.private_option;
		}
		if (formValues.profile_picture !== profile_picture.current) {
			updatedFields.profile_picture = formValues.profile_picture;
		}

		if (Object.keys(updatedFields).length === 0) {
			return;
		}

		const successFunc = (): void => {
			refreshUser({
				type: 'change fields',
				...updatedFields,
			});
			if (updatedFields.profile_picture !== undefined) {
				profile_picture.current = photo;
			}
			navigation.goBack();
		};

		setIsLoading(true); // Start loading
		void EndpointUpdateUser(updatedFields, successFunc).finally(() => {
			setIsLoading(false);
		});
	};

	const confirmDeletion = (): void => {
		Alert.alert(settings.deleteProfile, settings.youCannotUndoThisAction, [
			{
				text: settings.cancel,
				onPress: () => {},
				style: 'cancel',
			},
			{
				text: settings.delete,
				onPress: () => {
					void deleteUser();
				},
				style: 'destructive',
			},
		]);
	};

	const deleteUser = async (): Promise<void> => {
		const successFunc = (): void => {
			refreshUser({
				type: 'logout',
			});
			showSuccessToast(toast.yourProfileHasBeenDeleted);
		};

		setIsLoading(true);
		void EndpointDeleteUser(successFunc).finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<View style={styles.container}>
			<Header
				text={StackNavigation.Settings}
				leftButton={true}
				leftStepOverType={StepOverTypes.logout}
				leftButtonAction={() => {
					void EndpointLogout(refreshUser);
				}}
				rightButton={true}
				rightStepOverType={StepOverTypes.update}
				rightButtonAction={() => {
					void handleSubmit(updateUser)();
				}}
			/>
			<SettingsFields
				control={control}
				setValue={setValue}
				errors={errors}
				profile_picture={photo}
			/>

			<Button
				text={settings.delete}
				onPress={confirmDeletion}
				style={{
					position: 'absolute',
					bottom: GlobalStyles.layout.gap * 3,
					alignSelf: 'center',
				}}
				bgColor={GlobalStyles.colorPalette.danger[500]}
			/>

			{isLoading ? <Loading /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	error: {
		color: GlobalStyles.colorPalette.danger[500],
	},
	camera: {
		flex: 1,
	},
	modalGroup: {
		backgroundColor: GlobalStyles.colorPalette.primary[100],
		borderRadius: GlobalStyles.utils.smallRadius.borderRadius,
		gap: 5,
		width: '95%',
	},
	modalSelection: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
	},
	modalButtons: {
		width: '95%',
		alignItems: 'center',
		backgroundColor: GlobalStyles.colorPalette.primary[100],
		borderRadius: GlobalStyles.utils.smallRadius.borderRadius,
		padding: 15,
	},
	container: {
		flex: 1,
		gap: 30,
		paddingTop: 20,
	},
	settingsContainer: {
		alignItems: 'center',
		marginHorizontal: GlobalStyles.layout.xGap,
	},
});

export default SettingsPage;
