import { Pressable, StyleSheet, Text } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import React from 'react';

type ButtonPropsType = {
	text: string;
	onPress: (data: any) => void;
	disabled: boolean;
};

const Button = ({ text, onPress, disabled = false }: ButtonPropsType) => {
	return (
		<Pressable
			style={[
				styles.button,
				GlobalStyles.utils.shadow,
				GlobalStyles.utils.smallRadius,
				GlobalStyles.utils.shadow,
				,
				{
					backgroundColor: disabled
						? GlobalStyles.colorPalette.primary[200]
						: GlobalStyles.colorPalette.primary[500],
				},
			]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text
				style={{
					color: disabled
						? GlobalStyles.colorPalette.primary[400]
						: GlobalStyles.colorPalette.background,
				}}
			>
				{text}
			</Text>
		</Pressable>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 16,
		paddingVertical: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
});