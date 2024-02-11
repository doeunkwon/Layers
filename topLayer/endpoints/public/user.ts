import axios from 'axios';
import { Methods, Routers } from '../constants';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';
import { type User } from '../../types/User';
import { nullUser } from '../../constants/baseUsers';
import { userPictureProcessor } from '../General/Specialized/pictureProcessors';

export const EndpointGetUserPublic = async (
	userID: string,
	successFunc: (data: User) => void
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PublicUser + `/${userID}`;

	try {
		const { data, status } = await axios<{ data: User }>({
			method: method,
			url: url,
		});
		if (status === 200) {
			const user = await userPictureProcessor(data.data);
			successFunc(user);
		} else {
			throw new Error(
				`An Error Has Occurred -- Fetching User ${userID}: ${status}`
			);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		console.log('An Error Has Occurred -- Fetching User ', userID);
	}
};

export const EndpointGetUserPublicMarkedBar = async (
	userID: string
): Promise<User> => {
	const method = Methods.GET;
	const url = Routers.PublicUser + `/${userID}`;
	try {
		const { data, status } = await axios<{ data: User }>({
			method: method,
			url: url,
		});
		if (status === 200) {
			const user = await userPictureProcessor(data.data);
			return user;
		} else {
			throw new Error(
				`An Error Has Occurred -- Fetching MarkedBar User ${userID}: ${status}`
			);
		}
	} catch (err: unknown) {
		axiosEndpointErrorHandlerNoAlert(err);
		console.log('An Error Has Occurred -- Fetching MarkedBar User ', userID);
		return { ...nullUser };
	}
};
