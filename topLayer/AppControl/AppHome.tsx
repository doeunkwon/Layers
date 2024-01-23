import { StyleSheet, StatusBar, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from '../utils/StackNavigation';
import { StackNavigation } from '../constants/Enums';
import { navigationRef } from '../Navigation/RootNavigation';
import SignInPage from '../pages/SignIn/SignInPage';
import SignUpPage from '../pages/SignUp/SignUpPage';
import MainPage from '../pages/Main/MainPage';
import GlobalStyles from '../constants/GlobalStyles';
import { type User } from '../types/User';
import Toast from 'react-native-toast-message';
import { useUser } from '../Contexts/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CameraPfp from '../components/Camera/CameraPfp';
import { TransitionPresets } from '@react-navigation/stack';

const AppHome: React.FC = () => {
	const user: User = useUser();
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer ref={navigationRef}>
				<View style={styles.container}>
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
						}}
					>
						{user.uid === '' ? (
							<>
								<Stack.Screen
									name={StackNavigation.Login}
									component={SignInPage}
								/>
								<Stack.Screen
									name={StackNavigation.SignUp}
									component={SignUpPage}
								/>
								<Stack.Screen
									name={StackNavigation.CameraPfp}
									component={CameraPfp}
									options={{
										...TransitionPresets.ModalSlideFromBottomIOS,
										presentation: 'transparentModal',
									}}
								/>
							</>
						) : (
							<>
								<Stack.Screen
									name={StackNavigation.Main}
									component={MainPage}
								/>
							</>
						)}
					</Stack.Navigator>
					<ExpoStatusBar style="auto" />
				</View>

				<Toast />
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: GlobalStyles.colorPalette.background,
		paddingTop: Device.osName === 'Android' ? StatusBar.currentHeight : 0,
	},
});

export default AppHome;
