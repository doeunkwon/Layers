import { View, StyleSheet, Alert } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { usePhoto, usePhotoUpdate } from '../../Contexts/CameraContext';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { StackNavigation, StepOverTypes } from '../../constants/Enums';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { baseUrl } from '../../utils/apiUtils';
import { settings, toast } from '../../constants/GlobalStrings';
import { axiosEndpointErrorHandler } from '../../utils/ErrorHandlers';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import { handleLogout } from '../../endpoints/getUser';
import { useUpdateUser, useUser } from '../../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import SettingsFields from '../../components/Settings/SettingsFields';
import { Loading } from '../../components/Loading/Loading';
import Button from '../../components/Button/Button';

interface FormValues {
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	password: string;
	private_option: boolean;
	profile_picture: string;
}

const SettingsPage: React.FC = () => {
	const data = useUser();
	const refreshUser = useUpdateUser();
	const resetPhoto = usePhotoUpdate();

	const {
		first_name,
		last_name,
		email,
		username,
		private_option,
		profile_picture,
	} = data;

	const [isLoading, setIsLoading] = useState(false); // Add loading state
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const defaultForm = {
		first_name: first_name,
		last_name: last_name,
		email: email,
		username: username,
		password: '**********',
		private_option: private_option,
		profile_picture: profile_picture,
	};

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: defaultForm,
	});

	const photo = usePhoto();

	useEffect(() => {
		setValue('profile_picture', photo);
	}, [photo]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			resetPhoto({
				type: 'new photo',
				image: profile_picture,
			});
		});
		return unsubscribe;
	});

	const updateUser = async (formValues: FormValues): Promise<void> => {
		const updatedFields: Partial<FormValues> = {};

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
		if (formValues.profile_picture !== profile_picture) {
			updatedFields.profile_picture = formValues.profile_picture;
		}

		if (Object.keys(updatedFields).length === 0) {
			return;
		}
		setIsLoading(true); // Start loading
		try {
			const response = await axios.put(
				`${baseUrl}/api/private/users`,
				updatedFields,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.status === 200) {
				try {
					refreshUser({
						type: 'change fields',
						...updatedFields,
					});
					if (updatedFields.profile_picture !== undefined) {
						resetPhoto({
							type: 'new photo',
							image: profile_picture,
						});
					}
					navigation.goBack();
					showSuccessToast(toast.yourProfileHasBeenUpdated);
					setIsLoading(false); // Stop loading on success
				} catch (error) {
					setIsLoading(false); // Stop loading on error
					showErrorToast(toast.anErrorHasOccurredWhileUpdatingProfile);
				}
			} else {
				throw new Error('An error has occurred');
			}
		} catch (error) {
			axiosEndpointErrorHandler(error);
		}
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
					void handleDelete();
				},
				style: 'destructive',
			},
			]
		);
	};

	const handleDelete = async (): Promise<void> => {
		setIsLoading(true);
		try {
			const deleteUserResponse = await axios.delete(
				`${baseUrl}/api/private/users/`
			);
			if (deleteUserResponse.status === 200) {
				refreshUser({
					type: 'logout',
				});
				showSuccessToast(toast.yourProfileHasBeenDeleted);
			} else {
				showErrorToast(toast.anErrorHasOccurredWhileDeletingProfile);
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			axiosEndpointErrorHandler(error);
		}
	};

	return (
		<View style={styles.container}>
			<Header
				text={StackNavigation.Settings}
				leftButton={true}
				leftStepOverType={StepOverTypes.logout}
				leftButtonAction={() => {
					void handleLogout(refreshUser);
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

			{isLoading && <Loading />}
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
