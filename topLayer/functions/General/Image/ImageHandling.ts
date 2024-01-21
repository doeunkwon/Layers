import { mimeType } from '../../../constants/ImageHandling';

export const arrayBufferToBlob = (
	arrayBuffer: ArrayBuffer,
	type: string
): Blob => {
	return new Blob([arrayBuffer], { type: type });
};

export const createBlobUrl = (blob: Blob): string => {
	return URL.createObjectURL(blob);
};

export const imageUrl = (imageBuffer: ArrayBuffer): string => {
	const blob = arrayBufferToBlob(imageBuffer, mimeType);
	return createBlobUrl(blob);
};
