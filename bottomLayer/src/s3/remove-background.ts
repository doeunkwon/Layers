import axios from 'axios';
import FormData from 'form-data';

async function removeBackground(imageData: Buffer): Promise<Buffer> {
	try {
		if (
			process.env.CLIPDROP_ENDPOINT === null ||
			process.env.CLIPDROP_ENDPOINT === undefined ||
			process.env.CLIPDROP_ENDPOINT === '' ||
			process.env.CLIPDROP_API_KEY === null ||
			process.env.CLIPDROP_API_KEY === undefined ||
			process.env.CLIPDROP_API_KEY === ''
		) {
			throw new Error(
				'One or more clipdrop environment variables are not defined.'
			);
		}

		const formData = new FormData();
		formData.append('image_file', imageData, {
			filename: 'image', // Set the desired filename
		});

		const response = await axios.post(process.env.CLIPDROP_ENDPOINT, formData, {
			headers: {
				'x-api-key': process.env.CLIPDROP_API_KEY,
				Accept: 'image/jpeg',
			},
			responseType: 'arraybuffer',
		});
		console.log('removeBackground response: ', response.headers);

		return Buffer.from(response.data);
	} catch (error) {
		console.error('Error removing background:', error);
		throw error;
	}
}

export { removeBackground };
