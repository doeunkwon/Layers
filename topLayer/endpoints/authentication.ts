import axios from 'axios';
import { EndpointRouters } from './endpointRouters';
import { axiosEndpointErrorHandler } from 'utils/ErrorHandlers';

export const logout = async (): Promise<void> => {
	try {
		const { data, status } = await axios.get(
			EndpointRouters.AuthenticationLogout
		);

		if (status === 200) {
			return data.data;
		} else {
			throw Error('could not get user');
		}
	} catch (error) {
		axiosEndpointErrorHandler(error);
	}
};
