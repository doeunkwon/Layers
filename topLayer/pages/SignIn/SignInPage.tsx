import React from 'react';
import {
	Text,
	StyleSheet,
	Pressable,
	Keyboard,
	View,
	Image,
} from 'react-native';
import { StackNavigation } from '../../constants/Enums';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type StackTypes } from 'utils/StackNavigation';
import GlobalStyles from '../../constants/GlobalStyles';
import SignIn from './SignIn';

const LoginPage: React.FC = () => {
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();
	return (
		<>
			<Pressable onPress={Keyboard.dismiss} style={styles.container}>
				<Image
					style={styles.logo}
					source={require('../../assets/layers-logo.png')}
				/>
				<SignIn />
			</Pressable>
			<View
				style={{
					bottom: GlobalStyles.layout.gap * 3,
					alignSelf: 'center',
				}}
			>
				<Text>
					Don't have an account?{' '}
					<Text
						onPress={() => {
							navigation.navigate(StackNavigation.SignUp, {});
						}}
						style={{ color: GlobalStyles.colorPalette.info[500] }}
					>
						Sign up
					</Text>
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: GlobalStyles.layout.xGap,
		gap: 65,
		marginHorizontal: GlobalStyles.layout.xGap,
		paddingBottom: 50,
	},
	logo: {
		width: 80,
		height: 80,
	},
});

export default LoginPage;
