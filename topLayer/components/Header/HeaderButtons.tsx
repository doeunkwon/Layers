import React, { type ReactElement } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { StepOverTypes } from '../../constants/Enums';
import Icon from 'react-native-remix-icon';

export interface HeaderButtonPropsType {
	type: string;
	left: boolean; // determines the side of the button. True is left. False is right.
	handlePress: () => void;
	disabled?: boolean;
}

export function headerButtons({
	type,
	left,
	handlePress,
	disabled = false,
}: HeaderButtonPropsType): ReactElement {
	switch (type) {
		case StepOverTypes.send: {
			return (
				<Pressable
					onPress={handlePress}
					disabled={disabled}
					style={left ? styles.leftButton : styles.rightButton}
				>
					<Icon
						name={GlobalStyles.icons.sendOutline}
						color={
							disabled
								? GlobalStyles.colorPalette.info[900]
								: GlobalStyles.colorPalette.info[500]
						}
						size={GlobalStyles.sizing.icon.regular}
					/>
				</Pressable>
			);
		}
		case StepOverTypes.edit: {
			return (
				<Pressable
					onPress={handlePress}
					style={left ? styles.leftButton : styles.rightButton}
				>
					<Text style={styles.textButton}>{StepOverTypes.edit}</Text>
				</Pressable>
			);
		}
		case StepOverTypes.done: {
			return (
				<Pressable
					onPress={handlePress}
					disabled={disabled}
					style={left ? styles.leftButton : styles.rightButton}
				>
					<Text
						style={disabled ? styles.disabledTextButton : styles.textButton}
					>
						{StepOverTypes.done}
					</Text>
				</Pressable>
			);
		}
		case StepOverTypes.update: {
			return (
				<Pressable
					onPress={handlePress}
					style={left ? styles.leftButton : styles.rightButton}
				>
					<Text style={styles.textButton}>{StepOverTypes.update}</Text>
				</Pressable>
			);
		}
		case StepOverTypes.down: {
			return (
				<Pressable
					onPress={handlePress}
					style={left ? styles.leftButton : styles.rightButton}
				>
					<Text style={styles.textButton}>{StepOverTypes.down}</Text>
				</Pressable>
			);
		}
		case StepOverTypes.logout: {
			return (
				<Pressable
					onPress={handlePress}
					style={left ? styles.leftButton : styles.rightButton}
				>
					<Text style={styles.textButton}>{StepOverTypes.logout}</Text>
				</Pressable>
			);
		}
		case StepOverTypes.leftArrow: {
			return (
				<Pressable onPress={handlePress} style={styles.leftArrow}>
					<Icon
						name={GlobalStyles.icons.backOutline}
						color={GlobalStyles.colorPalette.primary[900]}
						size={GlobalStyles.sizing.icon.regular}
					/>
				</Pressable>
			);
		}
		case StepOverTypes.rightArrow: {
			return (
				<Pressable onPress={handlePress} style={styles.rightArrow}>
					<Icon
						name={GlobalStyles.icons.nextOutline}
						color={GlobalStyles.colorPalette.primary[900]}
						size={GlobalStyles.sizing.icon.regular}
					/>
				</Pressable>
			);
		}
		default:
			return <></>; // Handle default case if needed
	}
}

const styles = StyleSheet.create({
	textButton: {
		color: GlobalStyles.colorPalette.info[500],
		...GlobalStyles.typography.body,
	},
	disabledTextButton: {
		color: GlobalStyles.colorPalette.info[900],
		...GlobalStyles.typography.body,
	},
	leftButton: {
		position: 'absolute',
		left: 20,
		paddingRight: 20,
	},
	rightButton: {
		position: 'absolute',
		right: 20,
		paddingLeft: 20,
	},
	leftArrow: {
		position: 'absolute',
		left: 10,
		paddingRight: 20,
	},
	rightArrow: {
		position: 'absolute',
		right: 10,
		paddingLeft: 20,
	},
});
