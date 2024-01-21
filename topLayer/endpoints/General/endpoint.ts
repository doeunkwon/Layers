import axios from 'axios';
import {
	axiosEndpointErrorHandler,
	axiosEndpointErrorHandlerNoAlert,
} from '../../utils/ErrorHandlers';
import { type formUser, type User, type loginUser } from '../../types/User';
import { baseUrl } from '../../utils/apiUtils';

interface configProps {
	method: string;
	url: string;
	data?: any;
	headers?: {
		'Content-Type': string;
	};
}

interface endpointProps {
	config: configProps;
	successFunc?: (data: any) => void;
	failureFunc?: () => void;
	alert?: boolean;
}

export const endpoint = async ({
	config,
	successFunc,
	failureFunc,
	alert = false,
}: endpointProps): Promise<any> => {
	try {
		config.url = baseUrl + config.url;
		config.headers = {
			'Content-Type': 'application/json',
		};
		console.log('config: ', config);
		const { data, status } = await axios(config);

		console.log('data response: ', data);
		if (status === 200) {
			if (successFunc === null || successFunc === undefined) {
				return data.data;
			}
			successFunc(data.data);
		} else {
			throw new Error(`An Error Has Occurred With Status: ${status}`);
		}
	} catch (err: unknown) {
		if (alert) {
			axiosEndpointErrorHandler(err);
		} else {
			axiosEndpointErrorHandlerNoAlert(err);
		}
		if (failureFunc !== null && failureFunc !== undefined) {
			failureFunc();
		}
	}
};
