import React, { useState } from 'react';
import { View } from 'react-native';
import { type SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../components/Button/Button';
import GlobalStyles from '../../constants/GlobalStyles';
import { Loading } from '../../components/Loading/Loading';
import { useUpdateUser } from '../../Contexts/UserContext';
import LoginFields from '../../components/Settings/LogInFields';
import { type loginUser, type User } from '../../types/User';
import { EndpointLogin } from '../../endpoints/authentication';

const SignIn: React.FC = () => {
	const updateUser = useUpdateUser();
	const [isLoading, setIsLoading] = useState(false); // Add loading state

	const {
		control,
		handleSubmit,
		formState: { dirtyFields },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const signIn: SubmitHandler<loginUser> = (formData): void => {
		const formValues: loginUser = {
			password: formData.password,
			email: formData.email,
		};
		const successFunc = (data: User): void => {
			updateUser({
				type: 'change user',
				user: data,
			});
		};

		setIsLoading(true); // Start loading
		void EndpointLogin(formValues, successFunc).finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<View style={{ gap: 65, width: '100%' }}>
			<LoginFields control={control} />
			<View style={{ alignSelf: 'center' }}>
				<Button
					text="Sign in"
					onPress={() => {
						void handleSubmit(signIn)();
					}}
					disabled={isLoading || Object.keys(dirtyFields).length < 2}
					bgColor={GlobalStyles.colorPalette.primary[500]}
				/>
			</View>

			{isLoading ? <Loading /> : null}
		</View>
	);
};

export default SignIn;
