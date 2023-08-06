import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { type StackTypes } from '../../utils/StackNavigation';
import { StackNavigation } from '../../constants/Enums';

import GlobalStyles from '../../constants/GlobalStyles';
import SignIn from './SignIn';
import UserAuth from './UserAuth';
import Button from '../../components/Button/Button';

export default function LoginPage() {
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	const onPress = () => {
		navigation.navigate(StackNavigation.Auth);
	}

	return (
		<View style={styles.container}>
			<Text style={[GlobalStyles.typography.header, GlobalStyles.utils.font]}>
				Layers
			</Text>
			{/* <SignIn /> */}
			{/* <Text>
				Don't have an account?{' '}
				<Text
					onPress={() => {
						navigation.navigate(StackNavigation.SignUp);
					}}
					style={{ color: GlobalStyles.colorPalette.info[500] }}
				>
					Sign up
				</Text>
			</Text> */}

			<Button text='Get Started' bgColor={GlobalStyles.colorPalette.primary[500]} onPress={onPress} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: GlobalStyles.layout.xGap,
		gap: 65,
		marginHorizontal: GlobalStyles.layout.xGap,
	},
});
