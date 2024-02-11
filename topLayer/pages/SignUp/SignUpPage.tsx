import React from 'react';
import Header from '../../components/Header/Header';
import SignUp from './SignUp';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpPage: React.FC = () => {
	return (
		<SafeAreaView style={{ gap: 30, flex: 1 }}>
			<Header text="Sign up" leftBack={true} leftButton={true} />
			<SignUp />
		</SafeAreaView>
	);
};

export default SignUpPage;
