import axios from 'axios';
import { Methods } from '../Methods';
import { Routers } from '../Routers';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';

export const EndpointFollowUser = async (input: string): Promise<void> => {
	const method = Methods.POST;
	const url = Routers.PrivateUser + '/follow';
	const followID = { followedId: input };

	try {
		const { data, status } = await axios({
			method: method,
			url: url,
			data: followID,
		});
		if (status === 200) {
			console.log('Successfully Followed User: ', data.message);
		} else {
			throw new Error(`An Error Has Occurred -- Following A User: ${status}`);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		console.log('An Error Has Occurred -- Following A User');
	}
};

export const EndpointUnfollowUser = async (input: string): Promise<void> => {
	const method = Methods.POST;
	const url = Routers.PrivateUser + '/unfollow';
	const unfollowID = { unfollowedId: input };

	try {
		const { data, status } = await axios({
			method: method,
			url: url,
			data: unfollowID,
		});
		if (status === 200) {
			console.log('Successfully Unfollowed User: ', data.message);
		} else {
			throw new Error(`An Error Has Occurred -- Unfollowing A User: ${status}`);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		console.log('An Error Has Occurred -- Unfollowing A User');
	}
};
