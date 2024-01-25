import axios from 'axios';
import { Methods } from '../Methods';
import { Routers } from '../Routers';
import { axiosEndpointErrorHandlerNoAlert } from '../../utils/ErrorHandlers';
import { type User } from '../../types/User';
import { nullUser } from '../../constants/baseUsers';

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
			successFunc(data.data);
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
			return data.data;
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
