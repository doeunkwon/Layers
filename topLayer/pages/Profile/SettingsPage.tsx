import { View, Text, StyleSheet, Pressable, Keyboard } from 'react-native';
import StackedTextBox from '../../components/Textbox/StackedTextbox';
import { ITEM_SIZE } from '../../utils/GapCalc';
import RadioButton from '../../components/RadioButton/RadioButton';
import GlobalStyles from '../../constants/GlobalStyles';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import {
	type PrivacyOption,
	privacyOptions,
} from '../../constants/PrivateOptions';
import { Loading } from '../../components/Loading/Loading';
import { usePhoto, usePhotoUpdate } from '../../Contexts/CameraContext';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { StackNavigation, StepOverTypes } from '../../constants/Enums';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { baseUrl } from '../../utils/apiUtils';
import { toast, settings } from '../../constants/GlobalStrings';
import { axiosEndpointErrorHandler } from '../../utils/ErrorHandlers';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import { useUpdateUser, useUser } from '../../Contexts/UserContext';
import { updateUser } from '../../endpoints/getUser';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';

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

	const { first_name, last_name, email, username, private_option, pp_url } =
		data;

	const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Add loading state
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const defaultForm = {
		first_name: first_name,
		last_name: last_name,
		email: email,
		username: username,
		password: '**********',
		private_option: private_option,
		profile_picture: pp_url,
	};

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: defaultForm,
	});

	const handleLogout = async (): Promise<void> => {
		await axios(`${baseUrl}/logout`);
		refreshUser({
			type: 'logout',
		});
	};
	const profile_picture = usePhoto();

	useEffect(() => {
		setValue('profile_picture', profile_picture);
	}, [profile_picture]);

	useEffect(() => {
		if (showSuccessUpdate) {
			navigation.goBack();
			setShowSuccessUpdate(false);
		}
	}, [showSuccessUpdate]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			resetPhoto({
				type: 'new photo',
				image: data.pp_url,
			});
		});
		return unsubscribe;
	});

	const onSubmit = async (formValues: FormValues | any): Promise<void> => {
		console.log('values: ', formValues.profile_picture.substring(0, 10));
		if (data === null || data === undefined) {
			console.log('User data is not available.');
			return;
		}

		const updatedFields: Partial<FormValues> = {};

		if (formValues.first_name !== data.first_name) {
			updatedFields.first_name = formValues.first_name;
		}
		if (formValues.last_name !== data.last_name) {
			updatedFields.last_name = formValues.last_name;
		}
		if (formValues.email !== data.email) {
			updatedFields.email = formValues.email;
		}
		if (formValues.username !== data.username) {
			updatedFields.username = formValues.username;
		}
		if (formValues.password !== '**********') {
			updatedFields.password = formValues.password;
		}
		if (formValues.private_option !== data.private_option) {
			updatedFields.private_option = formValues.private_option;
		}
		if (formValues.profile_picture !== data.pp_url) {
			updatedFields.profile_picture = formValues.profile_picture;
		}

		if (Object.keys(updatedFields).length === 0) {
			console.log('No changes to update');
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
					// Causes a huge mess. Look into later. Just refresh and re-fetch for now.
					// const sessionData = JSON.stringify(response.data.data);
					// await AsyncStorage.setItem('session', sessionData);
					// updateData(sessionData);
					setShowSuccessUpdate(true);
					void updateUser(refreshUser);
					showSuccessToast(toast.yourProfileHasBeenUpdated);
					setIsLoading(false); // Stop loading on success
				} catch (error) {
					setIsLoading(false); // Stop loading on error
					console.log(error);
					showErrorToast(toast.anErrorHasOccurredWhileUpdatingProfile);
				}
			} else {
				throw new Error('An error has occurred');
			}
		} catch (error) {
			axiosEndpointErrorHandler(error);
		}
	};

	return (
		<View style={styles.container}>
			<Header
				text={StackNavigation.Settings}
				leftButton={true}
				leftStepOverType={StepOverTypes.logout}
				leftButtonAction={handleLogout}
				rightButton={true}
				rightStepOverType={StepOverTypes.update}
				rightButtonAction={() => {
					void handleSubmit(onSubmit)();
				}}
			/>
			<View style={{ gap: 40 }}>
				<View style={styles.settingsContainer}>
					<Pressable onPress={Keyboard.dismiss} style={{ gap: 40 }}>
						<View style={{ gap: GlobalStyles.layout.gap }}>
							<Pressable
								style={{ alignSelf: 'center' }}
								onPress={() => {
									navigation.navigate(StackNavigation.CameraWrapper, {
										returnToPfp: true,
									});
								}}
							>
								<ProfilePicture
									imageUrl={profile_picture}
									base64={profile_picture.slice(0, 5) !== 'https'}
								/>
							</Pressable>
							<View
								style={{
									flexDirection: 'row',
									gap: GlobalStyles.layout.gap,
									width: ITEM_SIZE(),
								}}
							>
								<Controller
									control={control}
									rules={{
										required: true,
										maxLength: 50,
									}}
									render={({ field: { onChange, value } }) => (
										<StackedTextBox
											label="First Name"
											onFieldChange={onChange}
											value={value.trim()}
										/>
									)}
									name="first_name"
								/>
								<Controller
									control={control}
									rules={{
										required: true,
										maxLength: 50,
									}}
									render={({ field: { onChange, value } }) => (
										<StackedTextBox
											label="Last Name"
											onFieldChange={onChange}
											value={value.trim()}
										/>
									)}
									name="last_name"
								/>
							</View>
							<Controller
								control={control}
								rules={{
									required: true,
									maxLength: 20,
								}}
								render={({ field: { onChange, value } }) => (
									<StackedTextBox
										label="Username"
										onFieldChange={onChange}
										value={value.trim()}
									/>
								)}
								name="username"
							/>
							<Controller
								control={control}
								rules={{
									required: true,
									pattern: /^\S+@\S+\.\S+$/,
									maxLength: 255,
								}}
								render={({ field: { onChange, value } }) => (
									<StackedTextBox
										label="Email"
										onFieldChange={onChange}
										value={value.trim()}
									/>
								)}
								name="email"
							/>
							<Controller
								control={control}
								rules={{
									required: true,
									minLength: 8,
									maxLength: 100,
								}}
								render={({ field: { onChange, value } }) => (
									<StackedTextBox
										label="Password"
										onFieldChange={onChange}
										value={value}
										secure
									/>
								)}
								name="password"
							/>
							<RadioButton
								privateData={privacyOptions}
								onSelect={(selectedOption: PrivacyOption) => {
									setValue('private_option', selectedOption.boolean);
								}}
								choice={
									control._defaultValues.private_option === true
										? privacyOptions[1].value
										: privacyOptions[0].value
								}
							/>
						</View>
						<View style={{ alignItems: 'center' }}>
							{errors.email != null && (
								<Text style={styles.error}>
									{settings.pleaseEnterAValidEmail}
								</Text>
							)}
							{errors.password != null && (
								<Text style={styles.error}>
									{settings.passwordMustBe8CharactersOrMore}
								</Text>
							)}
						</View>

						{isLoading && <Loading />}
					</Pressable>
				</View>
			</View>
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
		gap: 15,
		paddingTop: 20,
	},
	settingsContainer: {
		alignItems: 'center',
		marginHorizontal: GlobalStyles.layout.xGap,
	},
});

export default SettingsPage;
