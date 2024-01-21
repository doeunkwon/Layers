import React, { type ReactElement, memo } from 'react';
import { Image, type ImageStyle } from 'expo-image';
import { StyleSheet } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';

interface imageTypes {
	url: string;
	imageStyle?: ImageStyle;
}

const MemoImage = ({ url, imageStyle }: imageTypes): ReactElement => {
	return (
		<Image
			source={{ uri: url }}
			style={[styles.image, imageStyle]}
			contentFit="contain"
		/>
	);
};

export default memo(MemoImage);

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: GlobalStyles.utils.mediumRadius.borderRadius,
		backgroundColor: GlobalStyles.colorPalette.primary[200],
		aspectRatio: 1 / 1,
		position: 'relative',
	},
	image: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: GlobalStyles.utils.mediumRadius.borderRadius,
		backgroundColor: GlobalStyles.colorPalette.primary[200],
		flex: 1,
		width: '100%',
	},
});
