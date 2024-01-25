import axios from 'axios';
import { Methods } from '../../endpoints/Methods';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';

export const pictureProcessor = async (url: string): Promise<string> => {
	const method = Methods.GET;
	try {
		// const data2 = await fetch(url).blob();
		const { data, status } = await axios<{ data: Blob }>({
			method: method,
			url: url,
			responseType: 'blob',
		});
		if (status === 200) {
			const imageBlob = data.data;
			console.log('blob created: ', imageBlob, imageBlob instanceof Blob);

			const url = URL.createObjectURL(imageBlob);
			console.log('url: ', url);
			return url;
		} else {
			throw new Error(
				`An Error Has Occurred -- Processing Image ${url}: ${status}`
			);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		return '';
	}
};
