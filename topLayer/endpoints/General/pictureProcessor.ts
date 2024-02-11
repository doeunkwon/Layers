import { base64Prefix } from '../../utils/Base64Prefix';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';

export const photos = new Map<string, string>();
export const blobs = new Map<string, Blob>();

export const pictureProcessor = async (
	url: string,
	id: string
): Promise<string> => {
	try {
		if (url !== '' && photos.get(id) === undefined) {
			photos.set(id, `${base64Prefix}${url}`);
		}
		return id;
	} catch (err: unknown) {
		console.log(
			'Image Url Error Hit: ',
			err,
			'\n Url: ',
			url.substring(0, 100)
		);
		axiosEndpointErrorHandlerNoAlert(err);
		return '';
	}
};

export const deletePicture = (id: string): void => {
	const url = photos.get(id);
	photos.delete(id);
	blobs.delete(id);
	if (url !== undefined) {
		URL.revokeObjectURL(url);
	}
};

export const updatePicture = async (
	newUrl: string,
	id: string
): Promise<void> => {
	deletePicture(id);
	const response = await fetch(newUrl);
	const blob = await response.blob();
	console.log('blob created: ', blob, blob instanceof Blob);
	const localurl = URL.createObjectURL(blob);
	photos.set(id, localurl);
	blobs.set(id, blob);
};
