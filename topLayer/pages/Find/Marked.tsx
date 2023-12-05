import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	ImageSourcePropType,
} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { find } from '../../constants/GlobalStrings';
import { User } from '../../pages/Main';
import axios from 'axios';
import { baseUrl } from '../../utils/apiUtils';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';

interface MarkedPropsType {
	foreignUserIDs: any[];
}

const Marked = ({ foreignUserIDs }: MarkedPropsType) => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const set3Users = async () => {
			if (foreignUserIDs.length < 4) {
				console.log('3Users: ', foreignUserIDs);
				setUsers(foreignUserIDs.slice(0, 3));
			}
		};

		void set3Users();
	}, [foreignUserIDs]);

	return (
		<View style={styles.container}>
			<View style={styles.textArea}>
				<Text style={GlobalStyles.typography.body}>
					{foreignUserIDs.length} {find.marked}
				</Text>
				<Text style={styles.label}>{find.viewYourMarkedProfiles}</Text>
			</View>
			<View style={styles.profilePicturesContainer}>
				{users[0] && (
					<View style={styles.profilePicture}>
						<ProfilePicture
							imageUrl={users[0].pp_url ? users[0].pp_url : ''}
							size={GlobalStyles.sizing.pfp.small}
						/>
					</View>
				)}
				{users[1] && (
					<View style={styles.profilePicture}>
						<ProfilePicture
							imageUrl={users[1].pp_url ? users[1].pp_url : ''}
							size={GlobalStyles.sizing.pfp.small}
						/>
					</View>
				)}
				{users[2] && (
					<View style={styles.profilePicture}>
						<ProfilePicture
							imageUrl={users[2].pp_url ? users[2].pp_url : ''}
							size={GlobalStyles.sizing.pfp.small}
						/>
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: GlobalStyles.colorPalette.card[100],
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

export default Marked;
