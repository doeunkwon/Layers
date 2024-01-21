import { getBucketName, s3 } from '../utils/awsImport';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { jpegTest } from './jpeg';
import axios from 'axios';

let url = jpegTest;

async function loadImageFromS3(signedUrl: string): Promise<ArrayBuffer> {
	try {
		const response = await axios.get(signedUrl, {
			responseType: 'arraybuffer',
		});

		console.log('axios url: ', response.headers);

		return response.data;
	} catch (error) {
		console.error('Error loading image:', error);
		throw error;
	}
}

async function downloadURLFromS3(objectKey: string): Promise<ArrayBuffer> {
	if (objectKey === '') {
		return new ArrayBuffer(0);
	}

	const params = {
		Bucket: getBucketName(),
		Key: objectKey,
	};

	try {
		// if (url === '') {
		const signedUrl = await getSignedUrl(s3, new GetObjectCommand(params), {
			expiresIn: 10800,
		}); // TTL for presigned URL: 3 hours
		// url = signedUrl;
		// }

		const image = await loadImageFromS3(signedUrl);
		// const test = await fetch(signedUrl);
		// console.log(test.headers.get('Content-Type'));

		console.log('download: ', image);
		return image;
	} catch (error) {
		console.error('Error generating signed URL:', error);
		throw error;
	}
}

export { downloadURLFromS3 };
