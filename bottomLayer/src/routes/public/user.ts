import express, { type Request, type Response } from 'express';
import { pool } from '../../utils/sqlImport';
import { responseCallbackGet } from '../../utils/responseCallback';
import { downloadURLFromS3 } from '../../s3/download-url-from-s3';

const router = express.Router();

router.get('/:uid', (req: Request, res: Response): void => {
	const { uid } = req.params;
	const getUser = async (userId: string): Promise<void> => {
		try {
			const query = await pool.query(
				'SELECT * FROM backend_schema.user WHERE uid = $1',
				[userId]
			);
			let user = query.rows[0];
			const async1 = downloadURLFromS3(user.profile_picture);
			if (user.private_option === true) {
				const dummy = {
					uid: user.uid,
					username: user.username,
					first_name: user.first_name,
					last_name: user.last_name,
					profile_picture: user.profile_picture,
					private_option: user.private_option,
				};
				user = dummy;
			} else {
				delete user.password;
			}
			user.profile_picture = await async1;
			console.log('public get user: ', user.profile_picture.substring(0, 100));

			responseCallbackGet(null, user, res, 'User');
		} catch (error) {
			console.log('Public Get User By Uid Error: ', error);
			responseCallbackGet(error, null, res);
		}
	};

	void getUser(uid);
});

export { router as default, router as usersRoute };
