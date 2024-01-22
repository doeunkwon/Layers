import React, { memo, type ReactElement } from 'react';
import { type ImageStyle, Pressable, StyleSheet } from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import MemoImage from '../../components/Image/memoImage';

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
	let url = imageUrl ?? '';
	if (imageUrl.startsWith('/9j/')) {
		url = `data:image/jpeg;base64,${imageUrl}`;
	}

	return (
		<Pressable
			style={[styles.container]}
			disabled={disablePress}
			onPress={onPress}
		>
			<MemoImage source={url} style={{ ...imageStyle, ...styles.image }} />
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
