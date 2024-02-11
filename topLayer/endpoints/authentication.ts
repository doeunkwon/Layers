import axios from 'axios';
import { Methods, ContentType, Routers } from './constants';
import { showErrorToast, showSuccessToast } from '../components/Toasts/Toasts';
import { toast } from '../constants/GlobalStrings';
import { axiosEndpointErrorHandlerNoAlert } from '../utils/ErrorHandlers';
import { type loginUser, type formUser, type User } from '../types/User';
import { type Dispatch } from 'react';
import { type UserReducerProps } from '../Contexts/UserContext';
import { userPictureProcessor } from './General/Specialized/pictureProcessors';

export const EndpointLogin = async (
	input: loginUser,
	successFunc: (data: User) => void
): Promise<void> => {
	const method = Methods.POST;
	const url = Routers.AuthenticationLogin;

	try {
		const { data, status } = await axios<{ data: User }>({
			method: method,
			url: url,
			data: input,
			headers: {
				'Content-Type': ContentType,
			},
		});
		if (status === 200) {
			const user = await userPictureProcessor(data.data);
			successFunc(user);
		} else {
			throw new Error(`An Error Has Occurred -- Logging In: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.theEmailOrPasswordYouveEnteredIsIncorrect);
		console.log('An Error Has Occurred -- Logging In');
		axiosEndpointErrorHandlerNoAlert(err);
	}
};

export const EndpointSignup = async (
	input: formUser,
	successFunc: (data: User) => void
): Promise<void> => {
	const method = Methods.POST;
	const url = Routers.AuthenticationSignUp;

	try {
		const { data, status } = await axios<{ data: User }>({
			method: method,
			url: url,
			data: input,
			headers: {
				'Content-Type': ContentType,
			},
		});
		if (status === 200) {
			const user = await userPictureProcessor(data.data);
			successFunc(user);
			showSuccessToast(toast.yourProfileHasBeenCreated);
		} else {
			throw new Error(`An Error Has Occurred -- Signing In: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileCreatingProfile);
		console.log('An Error Has Occurred -- Signing In');
		axiosEndpointErrorHandlerNoAlert(err);
	}
};

export const EndpointLogout = async (
	dispatch: Dispatch<UserReducerProps>
): Promise<void> => {
	const method = Methods.GET;
	const url = Routers.AuthenticationLogout;

	try {
		const { status } = await axios({
			method: method,
			url: url,
		});
		if (status === 200) {
			dispatch({
				type: 'logout',
			});
			showSuccessToast(toast.youhaveloggedOut);
		} else {
			throw new Error(`An Error Has Occurred -- Logging Out: ${status}`);
		}
	} catch (err: unknown) {
		showErrorToast(toast.anErrorHasOccurredWhileLoggingOut);
		console.log('An Error Has Occurred -- Logging Out');
		axiosEndpointErrorHandlerNoAlert(err);
	}
};