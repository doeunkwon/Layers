import React, { type ReactElement, memo } from 'react';
import { type ImageStyle, Image, type ImageResizeMode } from 'react-native';

interface imageTypes {
	source: string;
	style?: ImageStyle;
	resizeMode?: ImageResizeMode;
}

const MemoImage = ({
	source,
	style,
	resizeMode = 'contain',
}: imageTypes): ReactElement => {
	return (
		<Image
			source={{ uri: source }}
			defaultSource={{ uri: source }}
			style={style}
			resizeMethod="scale"
			resizeMode={resizeMode}
		/>
	);
};

export default memo(MemoImage);
