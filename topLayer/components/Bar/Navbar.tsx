import { useNavigation } from '@react-navigation/native';
import React, { type ReactElement, useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-remix-icon';
import GlobalStyles from '../../constants/GlobalStyles';
import { MainPageContext } from '../../pages/Main/MainPage';
import { type StackTypes } from '../../utils/StackNavigation';
import { StackNavigation } from '../../constants/Enums';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

const Navbar = (): ReactElement => {
	const { navigationArray } = useContext(MainPageContext);
	const navigation = useNavigation<NativeStackNavigationProp<StackTypes>>();

	return (
		<View style={styles.container}>
			<View style={styles.icons}>
				<Pressable
					onPress={() => {
						navigationArray[1]();
					}}
				>
					<Icon
						name={GlobalStyles.icons.shirtOutline}
						color={GlobalStyles.colorPalette.primary[900]}
						size={GlobalStyles.sizing.icon.regular}
					/>
				</Pressable>
			</View>
			<View style={styles.icons}>
				<Pressable
					onPress={() => {
						navigation.navigate(StackNavigation.ItemCamera, {});
					}}
				>
					<Icon
						name={GlobalStyles.icons.addCircleOutline}
						color={GlobalStyles.colorPalette.primary[900]}
						size={GlobalStyles.sizing.icon.regular}
					/>
				</Pressable>
				<Pressable
					onPress={() => {
						navigationArray[2]();
					}}
				>
					<Icon
						name={GlobalStyles.icons.searchOutline}
						color={GlobalStyles.colorPalette.primary[900]}
						size={GlobalStyles.sizing.icon.regular}
					/>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: GlobalStyles.layout.xGap,
	},
	icons: {
		flexDirection: 'row',
		gap: 28,
	},
});

export default Navbar;
