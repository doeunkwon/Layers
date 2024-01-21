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

		const image = await loadImageFromS3(signedUrl);
		// const test = await fetch(signedUrl);
		// console.log(test.headers.get('Content-Type'));

		const url = base64ArrayBuffer(image);
		// }
		// console.log('download: ', image);
		return url;
	} catch (error) {
		console.error('Error generating signed URL:', error);
		throw error;
	}
}

function base64ArrayBuffer(arrayBuffer: ArrayBuffer): string {
	let base64 = '';
	const encodings =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	const bytes = new Uint8Array(arrayBuffer);
	const byteLength = bytes.byteLength;
	const byteRemainder = byteLength % 3;
	const mainLength = byteLength - byteRemainder;

	let a, b, c, d;
	let chunk;

	// Main loop deals with bytes in chunks of 3
	for (let i = 0; i < mainLength; i = i + 3) {
		// Combine the three bytes into a single integer
		chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

		// Use bitmasks to extract 6-bit segments from the triplet
		a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
		b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
		c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
		d = chunk & 63; // 63       = 2^6 - 1

		// Convert the raw binary segments to the appropriate ASCII encoding
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	}

	// Deal with the remaining bytes and padding
	if (byteRemainder === 1) {
		chunk = bytes[mainLength];

		a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

		// Set the 4 least significant bits to zero
		b = (chunk & 3) << 4; // 3   = 2^2 - 1

		base64 += encodings[a] + encodings[b] + '==';
	} else if (byteRemainder === 2) {
		chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

		a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
		b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

		// Set the 2 least significant bits to zero
		c = (chunk & 15) << 2; // 15    = 2^4 - 1

		base64 += encodings[a] + encodings[b] + encodings[c] + '=';
	}

	return base64;
}

export { downloadURLFromS3 };
