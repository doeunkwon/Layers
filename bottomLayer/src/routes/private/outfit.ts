import {
	responseCallbackDelete,
	responseCallbackDeleteAll,
	responseCallbackPost,
	responseCallbackUpdate,
} from '../../utils/responseCallback';
import { pool } from '../../utils/sqlImport';
import express, { type Request, type Response } from 'express';
import {
	getAllOutfits,
	getAllOutfitsCate,
	getOutfitById,
	getOutfitByIdCate,
	outfitCateQuery,
} from '../helper/outfit';

const router = express.Router();

// Endpoint for creating a new outfit
router.post('/', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { title, clothing_items } = req.body;

	const insertOutfit = async (): Promise<any> => {
		try {
			await pool.query(
				'INSERT INTO backend_schema.outfit (title, clothing_items, uid) VALUES ($1, $2, $3)',
				[title, clothing_items, uid]
			);

			responseCallbackPost(null, res, 'Outfit');
		} catch (error) {
			console.log('Private Create Outfit Error: ', error);
			responseCallbackPost(error, res);
		}
	};

	void insertOutfit();
});

// Endpoint for deleting a specific outfit
router.delete('/:outfitId', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { outfitId } = req.params;
	const deleteOutfit = async (outfitId: string): Promise<void> => {
		try {
			const deleteOutfit = await pool.query(
				'DELETE FROM backend_schema.outfit WHERE oid = $1 AND uid = $2',
				[outfitId, uid]
			);
			responseCallbackDelete(
				null,
				outfitId,
				res,
				'Outfit',
				deleteOutfit.rowCount
			);
		} catch (error) {
			console.log('Private Delete Outfit Error: ', error);
			responseCallbackDelete(error, outfitId, res, 'Outfit');
		}
	};

	void deleteOutfit(outfitId);
});

// Endpoint for updating a specific outfit
router.put('/:oid', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { oid } = req.params;
	// Extract outfit data from the request body
	const { title, clothing_items }: { title: string; clothing_items: string[] } =
		req.body;

	const updateOutfit = async (oid: string): Promise<void> => {
		// Initialize query parts
		let query = 'UPDATE backend_schema.outfit SET';

		// Append title to the query if provided
		if (title !== undefined) {
			query += ` title = '${title}',`;
		}

		// Append clothing_items to the query if provided
		if (clothing_items !== undefined) {
			const formattedUuidArray = clothing_items.map(
				(uuid) => `'${uuid}'::UUID`
			);
			query += ` clothing_items = ARRAY[${formattedUuidArray.join(
				', '
			)}]::UUID[],`;
		}

		try {
			// Finalize the query
			if (query === 'UPDATE backend_schema.outfit SET') {
				throw new Error('No Fields To Update');
			}
			query = query.slice(0, -1);
			query += ` WHERE oid = '${oid}' AND uid = '${uid}'`;

			// Update the outfit in the database
			const updateOutfit = await pool.query(query);

			// responds with successful update even when no changes are made
			responseCallbackUpdate(null, oid, res, 'Outfit', updateOutfit.rowCount);
		} catch (error) {
			console.log('Private Update Outfit Error: ', error);
			responseCallbackUpdate(error, oid, res, 'Outfit');
		}
	};

	void updateOutfit(oid);
});

// Endpoint for retrieving the logged in users outfit
router.get('/:outfitId', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { outfitId } = req.params;
	const { parse } = req.query;

	if (parse === 'categories') {
		const queryAdvanced = outfitCateQuery(outfitId, uid);
		void getOutfitByIdCate(queryAdvanced, res);
	} else {
		const queryBasic = `SELECT * FROM backend_schema.outfit WHERE oid = '${outfitId}' and uid = '${uid}'`;
		void getOutfitById(queryBasic, res);
	}
});

// Endpoint for retrieving all of the logged in user's outfits
router.get('/', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const { parse } = req.query;

	if (parse === 'categories') {
		const queryAdvanced = outfitCateQuery('', uid);
		void getAllOutfitsCate(queryAdvanced, res);
	} else {
		const queryBasic = `SELECT * FROM backend_schema.outfit WHERE uid = '${uid}'`;
		void getAllOutfits(queryBasic, res);
	}
});

// Endpoint for deleting all of the user's outfits
router.delete('/', (req: Request, res: Response): void => {
	const uid = req.user as string;

	const deleteAllOutfits = async (): Promise<void> => {
		try {
			const deleteOutfits = await pool.query(
				'DELETE FROM backend_schema.outfit WHERE uid = $1',
				[uid]
			);

			responseCallbackDeleteAll(null, res, 'Outfit', deleteOutfits.rowCount);
		} catch (error) {
			console.log('Private Delete All User Outfits Error: ', error);
			responseCallbackDeleteAll(error, res, 'Outfit');
		}
	};

	void deleteAllOutfits();
});

export { router as default, router as privateOutfitRoute };
