import { StyleSheet, View } from 'react-native';
import React, { memo, type ReactElement } from 'react';
import Icon from 'react-native-remix-icon';
import GlobalStyles from '../../constants/GlobalStyles';
import MemoImage from '../../components/Image/memoImage';
import { photos } from '../../endpoints/General/pictureProcessor';

interface ProfilePicturePropsType {
	imageUrl?: string;
	base64?: boolean;
	shadow?: boolean;
	size?: number;
	border?: boolean;
}

const ProfilePicture = ({
	imageUrl,
	shadow = true,
	size = GlobalStyles.sizing.pfp.regular,
	border = false,
}: ProfilePicturePropsType): ReactElement => {
	// console.log('profile picture image: ', imageUrl?.substring(0, 100));
	let url = imageUrl ?? '';
	if (!url.startsWith('data')) {
		const localUrl = photos.get(url);
		// console.log('local url: ', localUrl?.substring(0, 100));
		if (localUrl !== undefined) {
			url = localUrl;
		} else {
			url = '';
		}
	}

	// console.log('profile picture final image: ', url.substring(0, 100));

	return (
		<>
			{url !== '' ? (
				<MemoImage
					source={url}
					resizeMode="cover"
					style={{
						...styles.profilePicture,
						width: size,
						height: size,
						borderRadius: size / 2,
						borderWidth: border ? 1 : 0,
						borderColor: border ? 'white' : undefined,
					}}
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
	},
});
