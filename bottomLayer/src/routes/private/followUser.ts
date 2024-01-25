import express, { type Request, type Response } from 'express';
import {
	clientFollow,
	clientUnFollow,
	responseCallbackConnect,
	responseCallbackFollow,
	responseCallbackUnFollow,
} from '../../utils/responseCallback';
import { pool } from '../../utils/sqlImport';
import { once } from 'node:events';
import { QueryManager } from '../../utils/event-emitters/queryManager';
const router = express.Router();

// Endpoint for following a user, the url parameter is the user doing the following
router.post('/follow', (req: Request, res: Response): void => {
	// The followedId is the person getting followed. Follower is the one doing the following.
	const followerId = req.user as string;
	const { followedId } = req.body;
	if (followerId === followedId) {
		throw new Error('User is trying to follow themself, uid: ' + followerId);
	}

	// Perform follow user logic
	const follow = async (
		followerId: string,
		followedId: string
	): Promise<void> => {
		try {
			const client1 = pool.connect();
			const client2 = pool.connect();
			try {
				/*
        Following query user issues:
        1. The following user can be a non existing user, and return a rowcount of 1
        2. If the user is already following that user, returns rowcount 0
        3. If followed user is non existent return rowcount 0
        Follower query user issues:
        1. The follower user can be a non existing user, and return a rowcount of 1
        2. If the user is already a follower of that user, returns rowcount 0
        3. If following user is non existent return rowcount 0

        1. So if double 0, the two users are both following each other already, or both users are non-existent.
        2. If 1,0 one of the users is non-existent, Same with 0,1
        3. If 1,1 successfully followed the user
        The above follows under the assumption that if a user if following another user, he is already in their followers.

        If double 0 and all three queries return errors none of the users exist
        If double 0 and 2 follow queries return errors the two users are following each other already
        If one 0 and 2 queries 1 follow and 1 user the user doesn't exist
        If one 0 and 1 follow query the other user doesn't exist
        I believe these are all the cases
        */

				// Adds followed to the follower's followings array
				const following = `
          UPDATE backend_schema.user
          SET following = array_append(following, '${followedId}')
          WHERE uid = '${followerId}'
            AND '${followedId}' <> ALL (following)
        `;

				// Adds follower to the followed's followers array
				const follower = `
        UPDATE backend_schema.user 
          SET followers = array_append(followers, '${followerId}')
          WHERE uid = '${followedId}'
            AND '${followerId}' <> ALL (followers)
        `;

				const queryManager = new QueryManager(3);

				const queryTrigger = once(queryManager, 'proceed');

				const followingQ = clientFollow(
					followerId,
					following,
					client1,
					queryManager,
					'Following failure'
				);
				const followerQ = clientFollow(
					followedId,
					follower,
					client2,
					queryManager,
					'Follower failure'
				);

				// Check if the Follower User Exists
				const followerUser = await pool.query(
					'SELECT * FROM backend_schema.user WHERE uid = $1',
					[followerId]
				);
				if (followerUser.rows.length === 0) {
					queryManager.failure(
						'Follower User (the user doing the following) Not Found, uid: ' +
							followerId,
						'SELECT * FROM backend_schema.user WHERE uid = $1'
					);
				} else {
					queryManager.complete(
						'SELECT * FROM backend_schema.user WHERE uid = $1'
					);
				}

				const resolution = await queryTrigger;
				if (resolution[1] < 0) {
					// this is waiting for either followingQ and followerQ to revert changes
					await followingQ;
					await followerQ;
					queryManager.resolveFollowErrorLog(followerId, followedId);
				}

				responseCallbackFollow(null, followerId, followedId, res);
			} catch (error) {
				responseCallbackFollow(error, followerId, followedId, res);
			} finally {
				(await client1).release();
				(await client2).release();
			}
		} catch (error) {
			console.log('Follow User Error: ', error);
			responseCallbackConnect(error, res);
		}
	};
	void follow(followerId, followedId);
});

// Endpoint for unfollowing a user, the url parameter is the user doing the unfollowing
router.post('/unfollow', (req: Request, res: Response): void => {
	// The unfollowedId is the person getting unfollowed. Unfollower is the one doing the unfollowing.
	const unfollowerId = req.user as string;
	const { unfollowedId } = req.body;
	if (unfollowerId === unfollowedId) {
		throw new Error(
			'User is trying to unfollow themself, uid: ' + unfollowerId
		);
	}

	const unfollow = async (
		unfollowerId: string,
		unfollowedId: string
	): Promise<void> => {
		try {
			const client1 = pool.connect();
			const client2 = pool.connect();
			try {
				/*
        Unfollow query user issues:
        Should be almost identical to follow query user issues,
        except instead of adding to an array we remove instead

        Reverting the unfollow request is not needed
        As if a user doesn't exist which causes the caught errors to arise.
        Removing a non-existent User from an array would do nothing.
      */

				// Removes unfollowed from the unfollower's followings array
				const unfollowing = `
          UPDATE backend_schema.user
          SET following = array_remove(following, '${unfollowedId}')
          WHERE uid = '${unfollowerId}'
            AND '${unfollowedId}' = ANY(following)
        `;

				// Removes unfollower from the unfollowed's followers array
				const unfollower = `
        UPDATE backend_schema.user 
          SET followers = array_remove(followers, '${unfollowerId}')
          WHERE uid = '${unfollowedId}'
        `;

				const queryManager = new QueryManager(3);
				const queryTrigger = once(queryManager, 'proceed');

				const unFollowingQ = clientUnFollow(
					unfollowerId,
					unfollowing,
					client1,
					queryManager,
					'UnFollowing failure'
				);
				const unFollowerQ = clientUnFollow(
					unfollowedId,
					unfollower,
					client2,
					queryManager,
					'UnFollower failure'
				);

				// Check if the Unfollower User Exists
				const unfollowerUser = await pool.query(
					'SELECT * FROM backend_schema.user WHERE uid = $1',
					[unfollowerId]
				);
				if (unfollowerUser.rows.length === 0) {
					queryManager.failure(
						'UnFollower User (the user doing the unfollowing) Not Found, uid: ' +
							unfollowerId,
						'SELECT * FROM backend_schema.user WHERE uid = $1'
					);
				} else {
					queryManager.complete(
						'SELECT * FROM backend_schema.user WHERE uid = $1'
					);
				}

				const resolution = await queryTrigger;
				if (resolution[1] < 0) {
					// Note the following awaits are not needed because they should finish when they emit the events retrieved by queryTrigger
					await unFollowingQ;
					await unFollowerQ;
					queryManager.resolveUnFollowErrorLog(unfollowerId, unfollowedId);
				}

				responseCallbackUnFollow(null, unfollowerId, unfollowedId, res);
			} catch (error) {
				responseCallbackUnFollow(error, unfollowerId, unfollowedId, res);
			} finally {
				(await client1).release();
				(await client2).release();
			}
		} catch (error) {
			console.log('Unfollow User Error: ', error);
			responseCallbackConnect(error, res);
		}
	};
	void unfollow(unfollowerId, unfollowedId);
});

export { router as default, router as privateFollowUserRoute };
