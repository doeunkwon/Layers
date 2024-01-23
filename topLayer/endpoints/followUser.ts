import { baseUrl } from '../utils/apiUtils';
import axios from 'axios';
import { axiosEndpointErrorHandlerNoAlert } from '../utils/ErrorHandlers';

export const followUser = async (followedUid: string): Promise<void> => {
	try {
		const { data, status } = await axios.post(
			`${baseUrl}/api/private/users/follow`,
			{
				followedId: followedUid,
			}
		);
		if (status === 200) {
			console.log('Successfully Followed User: ', data.message);
		} else {
			throw new Error('An error has occurred while Following A User');
		}
	} catch (error) {
		axiosEndpointErrorHandlerNoAlert(error);
	}
};

export const unFollowUser = async (followedUid: string): Promise<void> => {
	try {
		const { data, status } = await axios.post(
			`${baseUrl}/api/private/users/unfollow`,
			{
				unfollowedId: followedUid,
			}
		);
		if (status === 200) {
			console.log('Successfully Unfollowed User: ', data.message);
		} else {
			throw new Error('An error has occurred while Unfollowing A User');
		}
	} catch (error) {
		axiosEndpointErrorHandlerNoAlert(error);
	}
};
