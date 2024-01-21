import { Pressable, StyleSheet, View } from 'react-native';
import React, { type ReactElement } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import FullName from '../Name/FullName';
import Username from '../Name/Username';
import { type User, type markedUser } from '../../types/User';

interface ProfileHeadingProps {
	user: markedUser | User;
	profilePicturePress?: () => void;
}

const ProfileHeading = ({
	user,
	profilePicturePress,
}: ProfileHeadingProps): ReactElement => {
	return (
		<View style={styles.profilePicture}>
			<Pressable onPress={profilePicturePress}>
				<ProfilePicture
					imageUrl={user?.profile_picture ?? ''}
					base64={user?.profile_picture.slice(0, 5) !== 'https'}
				/>
			</Pressable>
			<View>
				<FullName
					firstName={user?.first_name ?? ''}
					lastName={user?.last_name ?? ''}
				/>
				<Username username={user?.username ?? ''} />
			</View>
		</View>
	);
};

export default ProfileHeading;

const styles = StyleSheet.create({
	profilePicture: {
		alignItems: 'center',
		gap: 7,
		shadowColor: 'black',
	},
});
