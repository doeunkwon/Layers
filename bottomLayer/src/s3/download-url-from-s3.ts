import { getBucketName, s3 } from '../utils/awsImport';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { jpegTest } from './jpeg';
import axios from 'axios';
import * as fs from 'fs';

let url = jpegTest;

async function loadImageFromS3(signedUrl: string, path: string): Promise<void> {
	try {
		const response = await axios.get(signedUrl, {
			responseType: 'arraybuffer',
		});

		console.log('axios url: ', response.headers);
		// return new Promise((resolve, reject) => {
		// 	const writer = fs.createWriteStream(path);
		//
		// 	response.data.pipe(writer);
		// 	writer.on('finish', resolve);
		// 	writer.on('error', reject);
		// });
		// return response;
		// const blob = new Blob([new Uint8Array(response.data as number[])], {
		// 	type: 'image/jpeg',
		// });
	} catch (error) {
		console.error('Error loading image:', error);
	}
}

async function downloadURLFromS3(objectKey: string): Promise<string> {
	if (objectKey === '') {
		return '';
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

		const path: string = './downloaded_image.jpeg';
		await loadImageFromS3(signedUrl, path);
		// const test = await fetch(signedUrl);
		// console.log(test.headers.get('Content-Type'));

		return signedUrl;
	} catch (error) {
		console.error('Error generating signed URL:', error);
		throw error;
	}
}

export { downloadURLFromS3 };
