import React, { useState, useEffect, type ReactElement } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { find } from '../../constants/GlobalStrings';
import { isAnyUserArray, type privateUser, type User } from '../../types/User';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import { previewLength } from '../../constants/Find';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../constants/Enums';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type StackTypes } from '../../utils/StackNavigation';

interface MarkedPropsType {
	foreignUserIDs?: Array<string | User | privateUser>; // foreignUserIDs is now optional
}

const MarkedBar = ({ foreignUserIDs = [] }: MarkedPropsType): ReactElement => {
	// Default to an empty array if foreignUserIDs is undefined
	const [users, setUsers] = useState<User[]>([]);
	const navigation = useNavigation<StackNavigationProp<StackTypes>>();

	const handlePress = (): void => {
		navigation.navigate(StackNavigation.MarkedList, {});
	};

	useEffect(() => {
		const preview = foreignUserIDs.slice(0, previewLength);
		if (isAnyUserArray(preview)) {
			setUsers(preview);
		}
	}, [foreignUserIDs]);

	return (
		<Pressable onPress={handlePress}>
			<View style={styles.container}>
				<View style={styles.textArea}>
					<Text style={GlobalStyles.typography.body}>
						{foreignUserIDs.length} {find.marked}
					</Text>
					<Text style={styles.label}>{find.viewYourMarkedProfiles}</Text>
				</View>
				<View style={styles.profilePicturesContainer}>
					{users.slice(0, previewLength).map((user, index) => (
						<View key={index} style={styles.profilePicture}>
							<ProfilePicture
								imageUrl={user?.profile_picture ?? ''}
								size={GlobalStyles.sizing.pfp.small}
								border={true}
							/>
						</View>
					))}
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: GlobalStyles.colorPalette.primary[200],
		borderRadius: GlobalStyles.utils.mediumRadius.borderRadius,
		flexDirection: 'row',
		alignItems: 'center',
	},
	textArea: {
		flex: 1,
		gap: 5,
	},
	title: {
		...GlobalStyles.typography.body,
		color: GlobalStyles.colorPalette.primary[900],
	},
	label: {
		...GlobalStyles.typography.body2,
		color: GlobalStyles.colorPalette.primary[400],
	},
	profilePicturesContainer: {
		flexDirection: 'row',
	},
	profilePicture: {
		width: GlobalStyles.sizing.pfp.small,
		height: GlobalStyles.sizing.pfp.small,
		borderRadius: GlobalStyles.sizing.pfp.small / 2,
		marginLeft: -4,
	},
});

export default MarkedBar;
