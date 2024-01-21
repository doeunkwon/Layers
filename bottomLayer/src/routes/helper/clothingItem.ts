import { type Response } from 'express';
import { pool } from '../../utils/sqlImport';
import { downloadURLFromS3 } from '../../s3/download-url-from-s3';
import { AsyncManager } from '../../utils/event-emitters/asyncManager';
import { asyncHandler } from '../../utils/event-emitters/asyncHandler';
import { once } from 'node:events';
import {
	getUserCore,
	responseCallbackGet,
	responseCallbackGetAll,
} from '../../utils/responseCallback';
import { itemCategories } from '../../utils/constants/itemCategories';
import { type PoolClient } from 'pg';
import { downloadConditions } from '../../utils/constants/downloadConditions';

const clothingItemsOrder = 'ORDER BY created_at';

// Get Clothing Item By Id
export const getClothingById = async (
	queryString: string,
	res: Response
): Promise<any> => {
	try {
		const query = pool.query(queryString);
		const item = await query;
		const temp = item.rows;
		if (temp.length === 0) {
			return responseCallbackGet(null, temp, res, 'Clothing Item');
		}
		const result = temp[0];
		const imgRef = result.image_url;
		result.image_url = await downloadURLFromS3(imgRef);

		responseCallbackGet(null, result, res, 'Clothing Item');
	} catch (error) {
		responseCallbackGet(error, null, res);
	}
};

// Gets All Clothing Items for a User
export const getAllClothing = async (
	queryString: string,
	res: Response,
	client: Promise<PoolClient> | null = null,
	uid: string = ''
): Promise<any> => {
	try {
		const run = pool.query(queryString);
		if (client !== null) {
			await getUserCore(uid, await client);
		}
		const result = await run;
		const items = result.rows;
		if (items.length === 0) {
			return responseCallbackGetAll(items, res, 'Clothing Item');
		}
		const asyncManager = new AsyncManager(items.length);
		const asyncTrigger = once(asyncManager, 'proceed');
		for (const item of items) {
			void asyncHandler(
				item.image_url,
				item,
				asyncManager,
				downloadConditions.regular
			);
		}
		const resolution = await asyncTrigger;
		if (resolution[1] < 0) {
			throw new Error('Some Url Download Requests Failed');
		}
		responseCallbackGetAll(items, res, 'Clothing Items');
	} catch (error) {
		responseCallbackGet(error, null, res);
	} finally {
		if (client !== null) {
			(await client).release();
		}
	}
};

// Gets All Clothing Items for a User in Parsed Categorical Format
export const getAllClothingCate = async (
	queryString: string,
	res: Response,
	client: Promise<PoolClient> | null = null,
	uid: string = ''
): Promise<any> => {
	try {
		const run = pool.query(queryString + clothingItemsOrder);
		if (client !== null) {
			await getUserCore(uid, await client);
		}
		const result = await run;
		const items = result.rows;
		if (items.length === 0) {
			return responseCallbackGetAll(items, res, 'Clothing Item');
		}
		const asyncManager = new AsyncManager(items.length);
		const asyncTrigger = once(asyncManager, 'proceed');
		for (const item of items) {
			void asyncHandler(
				item.image_url,
				item,
				asyncManager,
				downloadConditions.regular
			);
		}
		const categories: Record<string, any> = {};
		Object.values(itemCategories).forEach((value) => {
			categories[value] = [];
		});
		const resolution = await asyncTrigger;
		if (resolution[1] < 0) {
			throw new Error('Some Url Download Requests Failed');
		}
		for (const item of items) {
			categories[item.category].push(item);
		}
		responseCallbackGetAll(categories, res, 'Clothing Items');
	} catch (error) {
		responseCallbackGet(error, null, res);
	} finally {
		if (client !== null) {
			(await client).release();
		}
	}
};
