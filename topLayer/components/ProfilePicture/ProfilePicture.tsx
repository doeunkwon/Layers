import { StyleSheet, View } from 'react-native';
import React, { memo, type ReactElement } from 'react';
import Icon from 'react-native-remix-icon';
import GlobalStyles from '../../constants/GlobalStyles';
import { Image } from 'expo-image';

interface ProfilePicturePropsType {
	imageUrl?: string;
	base64?: boolean;
	shadow?: boolean;
	size?: number;
	border?: boolean;
}

const ProfilePicture = ({
	imageUrl,
	base64 = false,
	shadow = true,
	size = GlobalStyles.sizing.pfp.regular,
	border = false,
}: ProfilePicturePropsType): ReactElement => {
	let url = imageUrl ?? '';
	if (imageUrl !== undefined && imageUrl.startsWith('/9j/')) {
		url = `data:image/jpeg;base64,${imageUrl}`;
	}

	return (
		// <View style={shadow && GlobalStyles.utils.pfpShadow}> // uncomment for pfp shadow
		<>
			{url !== '' ? (
				<Image
					style={[
						styles.profilePicture,
						{
							width: size,
							height: size,
							borderRadius: size / 2,
							borderWidth: border ? 1 : 0,
							borderColor: border ? 'white' : undefined,
						},
					]}
					source={{ uri: url }}
				/>
			) : (
				<View
					style={[
						styles.profilePicture,
						{
							width: size,
							height: size,
							borderRadius: size / 2,
							borderWidth: border ? 1 : 0,
							borderColor: border ? 'white' : undefined,
						},
					]}
				>
					<Icon
						name={GlobalStyles.icons.userOutline2}
						color={GlobalStyles.colorPalette.primary[300]}
						size={size / 2}
					/>
				</View>
			)}
		</>
	);
};

export default memo(ProfilePicture);

const styles = StyleSheet.create({
	profilePicture: {
		backgroundColor: GlobalStyles.colorPalette.card[300],
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'cover',
	},
});
