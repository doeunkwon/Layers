import { type Response } from 'express';
import {
	responseCallbackGet,
	responseCallbackGetAll,
} from '../../utils/responseCallback';
import { pool } from '../../utils/sqlImport';
import { AsyncManager } from '../../utils/event-emitters/asyncManager';
import { once } from 'node:events';
import { asyncHandler } from '../../utils/event-emitters/asyncHandler';
import { userFields } from '../../utils/constants/userFields';
import { downloadConditions } from '../../utils/constants/downloadConditions';

// Writes out the a prefix for Search Query so User Search doesn't overlap
export const userSearchQueryPrefix = (): string => {
	let userPrefix = '';
	for (const userField of Object.values(userFields)) {
		userPrefix += ' ' + userField + ' AS marked,';
	}
	userPrefix = userPrefix.slice(0, -1);
	return userPrefix;
};

export const userSearchQueryMarked = (
	uid: string = '',
	username: string = ''
): string => {
	let query = `
        SELECT *
        FROM backend_schema.user AS table1
        LEFT JOIN LATERAL (
          SELECT uid as marked
          FROM backend_schema.user 
          WHERE uid = ANY((ARRAY[table1.followers])::uuid[])
        `;
	if (uid !== '') {
		query += ` AND uid = '${uid}'`;
	}
	query += ') AS table2 ON true ';
	if (username !== '' && uid !== '') {
		query += ` WHERE table1.username ~* '${username}.*' AND table1.uid <> '${uid}'`;
	} else if (username !== '') {
		query += ` WHERE table1.oid = '${username}'`;
	} else {
		query += ` WHERE table1.uid = '${uid}'`;
	}

	// Extra Orderings by Marked and Private Option
	// CASE WHEN profile_picture IS NULL THEN 0 WHEN profile_picture = '' THEN 0 ELSE 1 END DESC,
	// CASE WHEN private_option is true then 0 else 1 end DESC,
	query += `ORDER BY 
    CASE WHEN marked IS NULL THEN 0 ELSE 1 END DESC,
      LENGTH(table1.username);`;
	return query;
};

// Endpoint for searching users by username or name
export const userSearchMarked = async (
	queryString: string,
	res: Response
): Promise<any> => {
	try {
		const query = pool.query(queryString);
		const result = await query;
		const users = result.rows;

		if (users.length === 0) {
			return responseCallbackGetAll(users, res, 'Users');
		}
		const asyncManager = new AsyncManager(users.length);
		const asyncTrigger = once(asyncManager, 'proceed');
		// I'm not sure if this is the fastest way to filter user data.
		// Deleting data could be faster or creating a new user data could be faster
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const marked = user.marked !== null;
			if (user.private_option === true) {
				const dummy = {
					uid: user.uid,
					username: user.username,
					first_name: user.first_name,
					last_name: user.last_name,
					profile_picture: user.profile_picture,
					private_option: user.private_option,
					marked: marked,
				};
				void asyncHandler(
					dummy.profile_picture,
					dummy,
					asyncManager,
					downloadConditions.profile_picture
				);
				users[i] = dummy;
			} else {
				void asyncHandler(
					user.profile_picture,
					user,
					asyncManager,
					downloadConditions.profile_picture
				);
				delete user.password;
				user.marked = marked;
			}
		}
		const resolution = await asyncTrigger;
		if (resolution[1] < 0) {
			throw new Error('Some Url Download Requests Failed');
		}

		responseCallbackGetAll(users, res, 'Users');
	} catch (err) {
		console.log('Private User Search Marked Error: ', err);
		responseCallbackGet(err, null, res);
	}
};

// Endpoint for searching users by username or name
export const userSearch = async (
	queryString: string,
	res: Response
): Promise<any> => {
	try {
		const query = pool.query(queryString);
		const result = await query;

		const users = result.rows;

		if (users.length === 0) {
			return responseCallbackGetAll(users, res, 'Users');
		}
		const asyncManager = new AsyncManager(users.length);
		const asyncTrigger = once(asyncManager, 'proceed');
		// I'm not sure if this is the fastest way to filter user data.
		// Deleting data could be faster or creating a new user data could be faster
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			if (user.private_option === true) {
				const dummy = {
					uid: user.uid,
					username: user.username,
					first_name: user.first_name,
					last_name: user.last_name,
					profile_picture: user.profile_picture,
					private_option: user.private_option,
				};
				void asyncHandler(
					dummy.profile_picture,
					dummy,
					asyncManager,
					downloadConditions.profile_picture
				);
				users[i] = dummy;
			} else {
				void asyncHandler(
					user.profile_picture,
					user,
					asyncManager,
					downloadConditions.profile_picture
				);
				delete user.password;
			}
		}
		const resolution = await asyncTrigger;
		if (resolution[1] < 0) {
			throw new Error('Some Url Download Requests Failed');
		}

		responseCallbackGetAll(users, res, 'Users');
	} catch (err) {
		console.log('User Search Error: ', err);
		responseCallbackGet(err, null, res);
	}
};
