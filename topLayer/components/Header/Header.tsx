import { View, Text, StyleSheet } from 'react-native';
import React, { type ReactElement, useContext } from 'react';
import GlobalStyles from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';
import { StepOverTypes } from '../../constants/Enums';

import { MainPageContext } from '../../pages/Main/MainPage';
import { headerButtons } from './HeaderButtons';

type anyFunc = (...args: any[]) => any;

interface HeaderPropType {
	text: string;
	rightBack?: boolean;
	leftBack?: boolean;
	rightButton?: boolean;
	leftButton?: boolean;
	rightStepOverType?: string;
	leftStepOverType?: string;
	rightButtonAction?: anyFunc;
	leftButtonAction?: anyFunc;
	rightButtonDisabled?: boolean;
	rightButtonNavigateTo?: number;
	leftButtonNavigateTo?: number;
}

const Header: React.FC<HeaderPropType> = ({
	text,
	rightBack,
	leftBack,
	rightButton,
	leftButton,
	rightStepOverType = StepOverTypes.rightArrow,
	leftStepOverType = StepOverTypes.leftArrow,
	rightButtonAction,
	leftButtonAction,
	rightButtonDisabled = false,
	rightButtonNavigateTo = -1,
	leftButtonNavigateTo = -1,
}: HeaderPropType) => {
	const { navigationArray } = useContext(MainPageContext);

	const navigation = useNavigation<StackNavigationProp<StackTypes>>();
	const handleRightPress = (): void => {
		if (rightButtonAction !== null && rightButtonAction !== undefined) {
			rightButtonAction();
		}
		if (rightBack === true) {
			navigation.goBack();
		}
		if (rightButtonNavigateTo !== -1) {
			navigationArray[rightButtonNavigateTo]();
		}
	};
	const handleLeftPress = (): void => {
		if (leftButtonAction !== null && leftButtonAction !== undefined) {
			leftButtonAction();
		}
		if (leftBack === true) {
			navigation.goBack();
		}
		if (leftButtonNavigateTo !== -1) {
			navigationArray[leftButtonNavigateTo]();
		}
	};

	const TextRender = (): ReactElement => {
		if (text !== '') {
			return <Text style={GlobalStyles.typography.subtitle}>{text}</Text>;
		} else {
			return (
				<View
					style={{
						height: 24,
						backgroundColor: GlobalStyles.colorPalette.primary[900],
					}}
				/>
			);
		}
	};

	return (
		<View style={styles.header}>
			{leftButton === true
				? headerButtons({
						type: leftStepOverType,
						left: true,
						handlePress: handleLeftPress,
						disabled: false,
					})
				: null}

			{rightButton === true
				? headerButtons({
						type: rightStepOverType,
						left: false,
						handlePress: handleRightPress,
						disabled: rightButtonDisabled,
					})
				: null}
			{TextRender()}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Header;
