import { type Dispatch } from 'react';
import { type User } from '../types/User';
import { nullUser } from '../constants/baseUsers';
import { type UserReducerProps } from '../Contexts/UserContext';
import { endpoint } from './General/endpoint';

export const getForeignUser = async (userId: string): Promise<User> => {
	const endpointConfig = {
		method: 'get',
		url: `/api/users/${userId}`,
	};

	const failureFunc = (): User => {
		return { ...nullUser };
	};

	return await endpoint({
		config: endpointConfig,
		failureFunc: failureFunc,
	});
};

const returnGetUser = async (): Promise<User> => {
	const endpointConfig = {
		method: 'get',
		url: '/api/private/users',
	};
	const failureFunc = (): User => {
		return { ...nullUser };
	};
	return await endpoint({
		config: endpointConfig,
		failureFunc: failureFunc,
	});
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
	const endpointConfig = {
		method: 'get',
		url: '/logout',
	};
	const successFunc = (): void => {
		dispatch({
			type: 'logout',
		});
	};
	void endpoint({
		config: endpointConfig,
		successFunc: successFunc,
		alert: true,
	});
};
