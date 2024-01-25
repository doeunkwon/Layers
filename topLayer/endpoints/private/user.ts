import axios from 'axios';
import { Methods } from '../Methods';
import { Routers } from '../Routers';
import {
	showErrorToast,
	showSuccessToast,
} from '../../components/Toasts/Toasts';
import { toast } from '../../constants/GlobalStrings';
import {
	axiosEndpointErrorHandler,
	axiosEndpointErrorHandlerNoAlert,
} from '../../utils/ErrorHandlers';
import { type formUser, type User } from '../../types/User';
import { ContentType } from '../../endpoints/constants';
import { type Dispatch } from 'react';
import { type UserReducerProps } from '../../Contexts/UserContext';

export const EndpointGetUserPrivate = async (
	dispatch: Dispatch<UserReducerProps>
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.PrivateUser;

	try {
		const { data, status } = await axios<{ data: User }>({
			method: method,
			url: url,
		});
		if (status === 200) {
			dispatch({
				type: 'change user',
				user: data.data,
			});
		} else {
			throw new Error(`An Error Has Occurred -- Fetching the User: ${status}`);
		}
	} catch (err: unknown) {
		console.log('An Error Has Occurred -- Fetching the User');
		axiosEndpointErrorHandlerNoAlert(err);
	}
};

export const EndpointUpdateUser = async (
	input: Partial<formUser>,
	successFunc: () => void
): Promise<void> => {
	const method = Methods.PUT;
	const url = Routers.PrivateUser;

	try {
		const { status } = await axios({
			method: method,
			url: url,
			data: input,
			headers: {
				'Content-Type': ContentType,
			},
		});
		if (status === 200) {
			successFunc();
			showSuccessToast(toast.yourProfileHasBeenUpdated);
		} else {
			throw new Error(`An Error Has Occurred -- Updating User: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileUpdatingProfile);
		console.log('An Error Has Occurred -- Updating User');
		axiosEndpointErrorHandler(err);
	}
};

export const EndpointDeleteUser = async (
	successFunc: () => void
): Promise<void> => {
	const method = Methods.DELETE;
	const url = Routers.PrivateUser;

	try {
		const { status } = await axios({
			method: method,
			url: url,
		});
		if (status === 200) {
			successFunc();
			showSuccessToast(toast.yourProfileHasBeenDeleted);
		} else {
			throw new Error(`An Error Has Occurred -- Deleting User: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileDeletingProfile);
		console.log('An Error Has Occurred -- Deleting User');
		axiosEndpointErrorHandler(err);
	}
};
