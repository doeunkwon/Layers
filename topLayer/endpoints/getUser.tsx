import { baseUrl } from '../utils/apiUtils';
import axios from 'axios';
import {
	axiosEndpointErrorHandler,
	axiosEndpointErrorHandlerNoAlert,
} from '../utils/ErrorHandlers';
import { type Dispatch } from 'react';
import { type retrievedUser, type User } from '../types/User';
import { nullUser } from '../constants/baseUsers';
import { type UserReducerProps } from '../Contexts/UserContext';
import { pictureProcessor } from '../functions/General/UserRetrieval';

export const getForeignUser = async (userId: string): Promise<User> => {
	try {
		const { data, status } = await axios.get<{ data: User }>(
			`${baseUrl}/api/users/${userId}`
		);

		if (status === 200) {
			return data.data;
		}
	} catch (error) {
		axiosEndpointErrorHandler(error);
	}
	return { ...nullUser };
};

export const getForeignUser2 = async (
	id: string,
	func: (data: User) => void
): Promise<void> => {
	try {
		const { data, status } = await axios.get<{ data: User }>(
			`${baseUrl}/api/users/${id}`
		);

		if (status === 200) {
			func(data.data);
		}
	} catch (error) {
		axiosEndpointErrorHandlerNoAlert(error);
	}
};

const returnGetUser = async (): Promise<User> => {
	try {
		const { data, status } = await axios.get<{ data: retrievedUser }>(
			`${baseUrl}/api/private/users`
		);

		if (status === 200) {
			// console.log('returngetuser: ', data.data);
			return pictureProcessor(data.data);
		} else {
			throw Error('could not get user');
		}
	} catch (error) {
		axiosEndpointErrorHandlerNoAlert(error);
	}
	return { ...nullUser };
};

export const updateUser = async (
	dispatch: Dispatch<UserReducerProps>
): Promise<void> => {
	const promUser = await returnGetUser();
	dispatch({
		type: 'change user',
		user: promUser,
	});
};

export const handleLogout = async (
	dispatch: Dispatch<UserReducerProps>
): Promise<void> => {
	await axios(`${baseUrl}/logout`);
	dispatch({
		type: 'logout',
	});
};
