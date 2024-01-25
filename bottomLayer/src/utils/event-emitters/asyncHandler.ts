import { downloadURLFromS3 } from '../../s3/download-url-from-s3';
import { type AsyncManager } from './asyncManager';
import { downloadConditions } from '../constants/downloadConditions';

// Note doesn't log the imageRef
export const asyncHandler = async (
	imgRef: string,
	objRef: any,
	asyncEmitter: AsyncManager,
	condition: downloadConditions,
	failure: string = 'Failure Downloading URL from S3: '
): Promise<void> => {
	try {
		const result = await downloadURLFromS3(imgRef);

		switch (
			condition // switch case for different download conditions
		) {
			case downloadConditions.regular:
				objRef.image_url = result;
				break;
			case downloadConditions.outfit:
				objRef.item_image_url = result;
				break;
			case downloadConditions.profile_picture:
				objRef.profile_picture = result;
				break;
			default:
				throw new Error('Invalid download condition');
		}

		asyncEmitter.complete(objRef.uid);
	} catch (error: unknown) {
		if (error instanceof Error) {
			switch (condition) {
				case downloadConditions.outfit:
					asyncEmitter.failure(
						failure + error.message + '\n with image: ' + imgRef,
						objRef.item_uid
					);
					break;
				default:
					asyncEmitter.failure(
						failure + error.message + '\n with image: ' + imgRef,
						objRef.uid
					);
					break;
			}
		}
	}
};
