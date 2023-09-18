import {
	Image,
	StyleSheet,
	Text,
	View,
	ImageSourcePropType,
} from 'react-native';
import React, { useContext } from 'react';
import Icon from 'react-native-remix-icon';
import GlobalStyles from '../../constants/GlobalStyles';

interface ProfilePicturePropsType {
	image?: string;
	base64?: boolean;
}

const ProfilePicture = ({ image, base64 = false }: ProfilePicturePropsType) => {
	const imgString = base64 ? `data:image/jpg;base64,${image}` : image;
	return (
		<Text>
			{image ? (
				<Image style={styles.profilePicture} source={{ uri: imgString }} />
			) : (
				<View style={styles.profilePicture}>
					<Icon
						name={GlobalStyles.icons.userOutline2}
						color={GlobalStyles.colorPalette.primary[300]}
						size={35}
					/>
				</View>
			)}
		</Text>
	);
};

export default ProfilePicture;

const styles = StyleSheet.create({
	profilePicture: {
		width: GlobalStyles.sizing.pfp.regular,
		height: GlobalStyles.sizing.pfp.regular,
		borderRadius: GlobalStyles.sizing.pfp.regular / 2,
		backgroundColor: GlobalStyles.colorPalette.primary[200],
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'cover',
	},
});
