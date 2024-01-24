import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import GlobalStyles from '../../constants/GlobalStyles';
import { defaultFormUser } from '../../constants/baseUsers';
import { Loading } from '../../components/Loading/Loading';
import { useUpdateUser } from '../../Contexts/UserContext';
import { usePhoto } from '../../Contexts/CameraContext';
import SettingsFields from '../../components/Settings/SettingsFields';
import { View } from 'react-native';
import { type User, type formUser } from '../../types/User';
import { EndpointSignup } from 'endpoints/authentication';

const SignUp: React.FC = () => {
	const updateUser = useUpdateUser();
	const profile_picture = usePhoto();

	const [isLoading, setIsLoading] = useState(false); // Add loading state

	const {
		control,
		handleSubmit,
		setValue,
		formState: { dirtyFields, errors },
	} = useForm({
		defaultValues: { ...defaultFormUser },
	});

	const signUp = (values: formUser): void => {
		const formValues: formUser = {
			first_name: values.first_name,
			last_name: values.last_name,
			username: values.username,
			email: values.email,
			password: values.password,
			profile_picture: profile_picture,
			private_option: values.private_option,
		};

		const successFunc = (data: User): void => {
			updateUser({
				type: 'change user',
				user: data,
			});
		};

		setIsLoading(true); // Start loading
		void EndpointSignup(formValues, successFunc).finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<SettingsFields
				control={control}
				setValue={setValue}
				errors={errors}
				profile_picture={profile_picture}
			/>

			<Button
				text="Sign up"
				onPress={() => {
					void handleSubmit(signUp)();
				}}
				style={{
					position: 'absolute',
					bottom: GlobalStyles.layout.gap * 3,
					alignSelf: 'center',
				}}
				disabled={isLoading || Object.keys(dirtyFields).length < 5}
				bgColor={GlobalStyles.colorPalette.primary[500]}
			/>

			{isLoading ? <Loading /> : null}
		</View>
	);
};

export default SignUp;
