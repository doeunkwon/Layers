import axios from 'axios';

import { useForm, Controller } from 'react-hook-form';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import StackedTextBox from '../../components/Textbox/StackedTextbox';
import Button from '../../components/Button/Button';
import { ITEM_SIZE } from '../../utils/GapCalc';
import RadioButton from '../../components/RadioButton/RadioButton';
import GlobalStyles from '../../constants/GlobalStyles';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';

import * as ImagePicker from 'expo-image-picker';
import { base64Prefix } from '../../utils/Base64Prefix';
import { baseUrl } from '../../utils/apiUtils';

type FormValues = {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
	private: boolean;
	profile_picture: string;
};

const SignUp = () => {
	const [image, setImage] = useState('');
	const [loading, setLoading] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { dirtyFields, errors },
	} = useForm({
		defaultValues: {
			first_name: '',
			last_name: '',
			username: '',
			email: '',
			password: '',
			private: false,
			profile_picture: image,
		},
	});

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			base64: true,
			aspect: [1, 1],
			quality: 0,
		});

		if (!result.canceled) {
			if (!result.assets) return;

			setImage(`${base64Prefix}${result.assets[0].base64}`);
		}
	};

	useEffect(() => {
		setValue('profile_picture', image);
	}, [image]);

	const onSubmit = async (data: FormValues | any) => {
		try {
			const response = await axios.post(`${baseUrl}/users`, {
				first_name: data.first_name,
				last_name: data.last_name,
				username: data.username,
				email: data.email,
				password: data.password,
				profile_picture: data.profile_picture,
				following: [],
				followers: [],
				private: data.private,
			});

			if (response.status === 200) {
				alert(`You have created: ${JSON.stringify(response.data)}`);
				setLoading(false);
			} else {
				throw new Error('An error has occurred');
			}
		} catch (error) {
			alert(error);
			setLoading(false);
		}
	};

	const privacyOptions = [
		{ value: 'Public', boolean: false },
		{ value: 'Private', boolean: true },
	];

	return (
		<View style={{ gap: 40 }}>
			<View style={{ gap: 16 }}>
				<Pressable
					style={{ alignItems: 'center' }}
					onPress={() => {
						pickImage();
					}}
				>
					<ProfilePicture image={image} />
				</Pressable>
				<View
					style={{
						flexDirection: 'row',
						gap: 16,
						width: ITEM_SIZE,
					}}
				>
					<Controller
						control={control}
						rules={{
							required: true,
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
						maxLength: 20, // Just a random number
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
						pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
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
						minLength: 5,
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
				<RadioButton data={privacyOptions} onSelect={setValue} />
			</View>
			<View style={{ alignItems: 'center' }}>
				{errors.email && (
					<Text style={styles.error}>Please enter a valid email.</Text>
				)}
				{errors.password && (
					<Text style={styles.error}>
						Password must be 5 characters or more.
					</Text>
				)}
			</View>
			<View style={{ alignSelf: 'center' }}>
				<Button
					text="Sign up"
					onPress={handleSubmit(onSubmit)}
					disabled={Object.keys(dirtyFields).length < 5 ? true : false}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	error: {
		color: GlobalStyles.colorPalette.danger[500],
	},
});

export default SignUp;
