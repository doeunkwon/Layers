import React, { memo, type ReactElement } from 'react';
import { Image, type ImageStyle, Pressable, StyleSheet } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';

interface ItemCellPropsType {
	imageUrl: string;
	disablePress?: boolean;
	imageStyle?: ImageStyle;
	onPress?: () => void;
	base64?: boolean;
}

const ItemCell = ({
	imageUrl,
	disablePress = true,
	imageStyle,
	onPress,
	base64,
}: ItemCellPropsType): ReactElement => {
	const url = base64 === true ? `data:image/jpeg;base64,${imageUrl}` : imageUrl;

	console.log('ItemCell url: ', url.substring(0, 100));
	return (
		<Pressable
			style={[styles.container]}
			disabled={disablePress}
			onPress={onPress}
		>
			<Image
				source={{ uri: url }}
				style={[styles.image, imageStyle]}
				resizeMode="contain"
			/>
		</Pressable>
	);
};

export default memo(ItemCell);

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
