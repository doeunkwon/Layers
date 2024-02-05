import { getBucketName, s3 } from '../utils/awsImport';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { jpegTest } from './jpeg';
import axios from 'axios';
import { Readable } from 'node:stream';

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

export async function downloadURLFromS3(objectKey: string): Promise<string> {
	if (objectKey === '') {
		return '';
	}

	const params = {
		Bucket: getBucketName(),
		Key: objectKey,
	};

	try {
		// const signedUrl = await getSignedUrl(s3, new GetObjectCommand(params), {
		// 	expiresIn: 10800,
		// }); // TTL for presigned URL: 3 hours
		// return signedUrl;
		const response = await s3.send(new GetObjectCommand(params));
		if (response.Body !== undefined) {
			return await response.Body.transformToString('base64');
		}
		return '';
	} catch (error) {
		console.error('Error generating signed URL:', error);
		throw error;
	}
}
