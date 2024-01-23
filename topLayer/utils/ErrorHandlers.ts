import axios, { type AxiosError } from 'axios';
import { Alert } from 'react-native';

export const axiosEndpointErrorHandler = (err: unknown): void => {
	console.log('Error Handler');
	const error = err as Error | AxiosError;
	if (
		axios.isAxiosError(error) &&
		error.response !== null &&
		error.response !== undefined
	) {
		console.log(error.response.data);
		console.log(error.response.status);
		Alert.alert(error.response.data.message);
	} else {
		console.log(error); // Just a stock error
		Alert.alert(error.message);
	}
};

export const axiosEndpointErrorHandlerNoAlert = (err: unknown): void => {
	console.log('Error Handler');
	const error = err as Error | AxiosError;
	if (
		axios.isAxiosError(error) &&
		error.response !== null &&
		error.response !== undefined
	) {
		console.log(error.response.data);
		console.log(error.response.status);
	} else {
		console.log(error);
	}
};
