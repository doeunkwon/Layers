import { endpoint } from './General/endpoint';

export const followUser = async (followedUid: string): Promise<void> => {
	const endpointConfig = {
		method: 'post',
		url: '/api/private/users/follow',
		data: {
			followedId: followedUid,
		},
	};
	const successFunc = (): void => {
		console.log('Successfully Followed User');
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
	});
};

export const unFollowUser = async (followedUid: string): Promise<void> => {
	const endpointConfig = {
		method: 'post',
		url: '/api/private/users/unfollow',
		data: {
			unfollowedId: followedUid,
		},
	};
	const successFunc = (): void => {
		console.log('Successfully Unfollowed User');
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
	});
};
