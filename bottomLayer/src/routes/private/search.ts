import express, { type Request, type Response } from 'express';
import { userSearchMarked, userSearchQueryMarked } from '../helper/search';

const router = express.Router();

router.get('/:username', (req: Request, res: Response): void => {
	const uid = req.user as string;
	const username = req.params.username;

	const query = userSearchQueryMarked(uid, username);
	void userSearchMarked(query, res);
});

export { router as default, router as searchRoute };
