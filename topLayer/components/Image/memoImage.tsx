import { photos } from '../../endpoints/General/pictureProcessor';
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
	// console.log('memo image source: ', source);
	// console.log('memo image photos: ', photos);
	let url = source;
	if (!source.startsWith('data')) {
		const localUrl = photos.get(source);
		if (localUrl !== undefined) {
			url = localUrl;
		}
	}

	// console.log('memoimage final url: ', url.substring(0, 100));

	return (
		<Image
			source={{ uri: url }}
			defaultSource={{ uri: url }}
			style={style}
			resizeMethod="scale"
			resizeMode={resizeMode}
		/>
	);
};

export default memo(MemoImage);
