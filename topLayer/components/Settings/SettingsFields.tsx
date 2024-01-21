import { type ReactElement } from 'react';
import React, {
	View,
	Text,
	StyleSheet,
	Pressable,
	Keyboard,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { StackNavigation } from '../../constants/Enums';
import { ITEM_SIZE } from '../../utils/GapCalc';
import StackedTextBox from '../../components/Textbox/StackedTextbox';
import RadioButton from '../../components/RadioButton/RadioButton';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import {
	type PrivacyOption,
	privacyOptions,
} from '../../constants/PrivateOptions';
import { settings } from '../../constants/GlobalStrings';
import {
	type Control,
	Controller,
	type UseFormSetValue,
	type FieldErrors,
} from 'react-hook-form';
import { userFieldRules } from '../../constants/userConstraints';
import { usePhotoUpdate } from '../../Contexts/CameraContext';
import { type formUser } from '../../types/User';

interface SettingsFieldsType {
	control: Control<formUser>;
	setValue: UseFormSetValue<formUser>;
	errors: FieldErrors<formUser>;
	profile_picture: string;
}

const SettingsFields = ({
	control,
	setValue,
	errors,
	profile_picture,
}: SettingsFieldsType): ReactElement => {
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	const resetPhoto = usePhotoUpdate();
	const navigateToCamera = (): void => {
		navigation.navigate(StackNavigation.CameraPfp, {});
	};

	const showProfileOptions = (): void => {
		Alert.alert(settings.editProfilePicture, '', [
			{
				text: settings.cancel,
				onPress: () => {},
				style: 'cancel',
			},
			{
				text: settings.change,
				onPress: navigateToCamera,
			},
			{
				text: settings.remove,
				onPress: () => {
					resetPhoto({
						type: 'null photo',
						image: '',
					});
				},
			},
		]);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.settingsContainer}>
					<Pressable onPress={Keyboard.dismiss}>
						<View style={{ gap: 30 }}>
							<View style={{ gap: 7 }}>
								<Pressable
									style={{ alignSelf: 'center' }}
									onPress={
										profile_picture !== ''
											? showProfileOptions
											: navigateToCamera
									}
								>
									<ProfilePicture
										imageUrl={profile_picture}
										base64={profile_picture.slice(0, 5) !== 'https'}
									/>
								</Pressable>
							</View>

							<View style={{ gap: GlobalStyles.layout.gap }}>
								<View
									style={{
										flexDirection: 'row',
										gap: GlobalStyles.layout.gap,
										width: ITEM_SIZE(),
									}}
								>
									<Controller
										control={control}
										rules={userFieldRules.firstName}
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
										rules={userFieldRules.lastName}
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
									rules={userFieldRules.username}
									render={({ field: { onChange, value } }) => (
										<StackedTextBox
											autoCapitalize="none"
											label="Username"
											onFieldChange={onChange}
											value={value.trim()}
										/>
									)}
									name="username"
								/>
								<Controller
									control={control}
									rules={userFieldRules.email}
									render={({ field: { onChange, value } }) => (
										<StackedTextBox
											autoCapitalize="none"
											label="Email"
											onFieldChange={onChange}
											value={value.trim()}
										/>
									)}
									name="email"
								/>
								<Controller
									control={control}
									rules={userFieldRules.password}
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
							{errors.email != null || errors.password != null ? (
								<View style={{ alignItems: 'center' }}>
									{errors.email != null ? (
										<Text style={styles.error}>
											{settings.pleaseEnterAValidEmail}
										</Text>
									) : null}
									{errors.password != null ? (
										<Text style={styles.error}>
											{settings.passwordMustBe8CharactersOrMore}
										</Text>
									) : null}
								</View>
							) : null}
						</View>
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
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
	settingsContainer: {
		alignItems: 'center',
		marginHorizontal: GlobalStyles.layout.xGap,
	},
	removeText: {
		color: GlobalStyles.colorPalette.info[500],
		...GlobalStyles.typography.body,
	},
});

export default SettingsFields;
