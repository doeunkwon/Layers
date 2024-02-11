import { Router, type Request, type Response } from 'express';
import { pool } from '../../utils/sqlImport';
import {
	responseCallbackDelete,
	responseCallbackDeleteAll,
	responseCallbackPost,
	responseCallbackUpdate,
} from '../../utils/responseCallback';
import { convertImage } from '../../s3/convert-image';
import { deleteObjectFromS3 } from '../../s3/delete-object-from-s3';
import { v4 as uuidv4 } from 'uuid';
import {
	getClothingById,
	getAllClothing,
	getAllClothingCate,
} from '../helper/clothingItem';
import { type ClothingCreationProps } from '../../../src/types/items';
const router = Router();

// Endpoint for creating a specific clothing item
router.post('/', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { image, category, title, brands, size, color }: ClothingCreationProps =
		req.body;
	const insertClothingItem = async (): Promise<void> => {
		try {
			if (
				image === null ||
				image === undefined ||
				image.trim() === '' ||
				category === null ||
				category === undefined
			) {
				throw new Error('Missing Image or Category Fields');
			}
			let query = `INSERT INTO backend_schema.clothing_item (ciid, image_url, category, title, brands, size, color, uid)
      VALUES (`;

			const ciid = uuidv4();
			query += `'${ciid}', `;
			const imgRef = await convertImage(image, ciid, false);
			query += `'${imgRef}', `;
			query += `'${category}', `;
			if (title !== undefined && title !== null) {
				query += `'${title}', `;
			} else {
				query += "'', ";
			}
			if (brands !== undefined && brands !== null) {
				const brandsArray = brands.map((brand) => `'${brand}'::string`);
				query += `ARRAY[${brandsArray.join(', ')}]::string[], `;
			} else {
				query += 'ARRAY[]::VARCHAR[], ';
			}
			if (size !== undefined && size !== null) {
				query += `'${size}', `;
			} else {
				query += "'', ";
			}
			if (color !== undefined && color !== null) {
				const colorsArray = color.map((col) => `'${col}'::color_enum`);
				query += `ARRAY[${colorsArray.join(', ')}]::color_enum[], `;
			} else {
				query += 'ARRAY[]::color_enum[], ';
			}
			query += `'${uid}')`;

			await pool.query(query);

			responseCallbackPost(null, res, 'Clothing Item: ' + ciid);
		} catch (error) {
			console.log('Private Create Clothing Item Error: ', error);
			responseCallbackPost(error, res);
		}
	};
	void insertClothingItem();
});

// Endpoint for deleting a specific clothing_item
router.delete('/:ciid', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { ciid } = req.params;
	const deleteItem = async (ciid: string): Promise<void> => {
		const client = pool.connect();
		try {
			const async1 = deleteObjectFromS3(ciid);
			const cli = await client;
			const async2 = pool.query(
				'DELETE FROM backend_schema.clothing_item WHERE ciid = $1 AND uid = $2',
				[ciid, uid]
			);
			const async3 = cli.query(
				`UPDATE backend_schema.outfit SET clothing_items = array_remove(clothing_items, '${ciid}')`
			);

			const removeFromOutfit = await async3;
			const deleteItem = await async2;
			await async1;

			responseCallbackDelete(
				null,
				ciid,
				res,
				'Clothing Item',
				deleteItem.rowCount
			);
		} catch (error) {
			console.log('Private Private Delete Clothing Item Error: ', error);
			responseCallbackDelete(error, ciid, res, 'Clothing Item');
		} finally {
			(await client).release();
		}
	};
	void deleteItem(ciid);
});

// Endpoint for updating a specific clothing_item
router.put('/:ciid', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { ciid } = req.params;
	const { category, title, size, color }: ClothingCreationProps = req.body;

	const updateItem = async (ciid: string): Promise<void> => {
		try {
			let query = 'UPDATE backend_schema.clothing_item SET';

			if (category !== undefined && category !== null) {
				query += ` category = '${category}',`;
			}
			if (title !== undefined && title !== null) {
				query += ` title = '${title}',`;
			}
			if (size !== undefined && size !== null) {
				query += ` size = '${size}',`;
			}
			if (color !== undefined && color !== null) {
				const colorsArray = color.map((col) => `'${col}'::color_enum`);
				query += ` color = ARRAY[${colorsArray.join(', ')}]::color_enum[],`;
			}

			// Check if at least one field is provided
			if (query === 'UPDATE backend_schema.clothing_item SET') {
				throw new Error('No Fields To Update');
			}

			query = query.slice(0, -1);
			query += ` WHERE ciid = '${ciid}' AND uid = '${uid}'`;

			// Execute the update query
			const updateResult = await pool.query(query);
			responseCallbackUpdate(
				null,
				ciid,
				res,
				'Clothing Item',
				updateResult.rowCount
			);
		} catch (error) {
			console.log('Private Update Clothing Item Error: ', error);
			responseCallbackUpdate(error, ciid, res, 'Clothing Item');
		}
	};

	void updateItem(ciid);
});

// Endpoint for retrieving the logged in users clothing item
router.get('/:itemId', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { itemId } = req.params;

	const query = `
        SELECT *, to_json(color) AS color FROM backend_schema.clothing_item WHERE ciid = '${itemId}' AND uid = '${uid}'`;
	void getClothingById(query, res);
});

// Endpoint for retrieving all a logged in users clothing items
router.get('/', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { parse } = req.query;
	const query = `SELECT *, to_json(color) AS color FROM backend_schema.clothing_item WHERE uid = '${uid}'`;

	if (parse === 'categories') {
		void getAllClothingCate(query, res);
	} else {
		void getAllClothing(query, res);
	}
});

// Endpoint for deleting all clothing items associated with the user
router.delete('/', (req: Request, res: Response): void => {
	const uid = req.user as string;

	const deleteAllClothingItems = async (): Promise<void> => {
		try {
			const ciidsResult = await pool.query(
				'SELECT ciid FROM backend_schema.clothing_item WHERE uid = $1',
				[uid]
			);
			const ciids = ciidsResult.rows.map((row) => row.ciid);
			const [deleteClothingItems] = await Promise.all([
				pool.query('DELETE FROM backend_schema.clothing_item WHERE uid = $1', [
					uid,
				]),
				ciids.map((ciid) => deleteObjectFromS3(ciid)),
			]);

			responseCallbackDeleteAll(
				null,
				res,
				'Clothing Item',
				deleteClothingItems.rowCount
			);
		} catch (error) {
			console.log('Private Deleting All Clothing Items Error: ', error);
			responseCallbackDeleteAll(error, res, 'Clothing Item');
		}
	};

	void deleteAllClothingItems();
});

export { router as default, router as privateClothingRoute };
